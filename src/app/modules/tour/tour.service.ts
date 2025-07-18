import { excludeField } from "../../constants";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";


const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name })

    if (existingTourType) throw new Error("Tour type already exists")

    return await TourType.create(payload)
}

const getAllTourTypes = async () => {
    const allTourTypes = await TourType.find({});
    const totalTypes = await TourType.countDocuments();
    return {
        data: allTourTypes,
        meta: {
            total: totalTypes
        }
    }
}

const getTourTypeById = async (id: string) => {
    const tourType = await TourType.findById(id);
    if (!tourType) throw new Error("Tour type not found")
    return {
        data: tourType,
    }
}
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id)
    if (!existingTourType) throw new Error("Tour type not found")

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return updatedTourType
}

const deleteTourType = async (id: string) => {
    const tourType = await TourType.findById(id);
    if (!tourType) throw new Error("Tour type not found")
    await TourType.findByIdAndDelete(id)
    return null
}


const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title })

    if (existingTour) {
        throw new Error("A tour with this title already exists")
    }


    // const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}`

    // let counter = 0;

    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }
    // payload.slug = slug;

    const tour = await Tour.create(payload)

    return tour
}

const getAllTours = async (query: Record<string, string>) => {
    const filter = query;
    const searchTerm = query.searchTerm || "";
    const sort = query.sort || "-createdAt";
    const fields = query.fields?.split(",").join(" ") || ""
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit

    // delete filter["searchTerm"]
    // delete filter["sort"]


    for (const field of excludeField) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field]
    }

    const searchQuery = {
        $or: tourSearchableFields.map((field) => (
            { [field]: { $regex: searchTerm, $options: "i" } }
        ))
    }

    // const tours = await Tour.find({
    //     // title: { $regex: searchTerm, $options: "i" }

    //     // $or: [
    //     //     { title: { $regex: searchTerm, $options: "i" } },
    //     //     { description: { $regex: searchTerm, $options: "i" } },
    //     //     { location: { $regex: searchTerm, $options: "i" } },
    //     // ]

    // })

    const tours = await Tour
        .find(searchQuery).
        find(filter)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit);
    const totalTours = await Tour.countDocuments()

    return {
        data: tours,
        meta: {
            total: totalTours
        }
    }
}

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id)
    if (!existingTour) throw new Error("Tour not found.")

    // const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}`

    // let counter = 0;

    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }
    // payload.slug = slug;

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return updatedTour
}


const deleteTour = async (id: string) => {
    const existingTour = await Tour.findById(id)
    if (!existingTour) throw new Error("Tour not found")

    await Tour.findByIdAndDelete(id)

    return null
}

export const tourService = {
    createTourType,
    getAllTourTypes,
    getTourTypeById,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTours,
    updateTour,
    deleteTour
}
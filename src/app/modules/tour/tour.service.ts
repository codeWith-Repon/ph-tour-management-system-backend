import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields, tourTypeSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";


const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name })

    if (existingTourType) throw new Error("Tour type already exists")

    return await TourType.create(payload)
}

const getAllTourTypes = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(TourType.find(), query)

    const tourTypes = await queryBuilder
        .search(tourTypeSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        tourTypes.build(),
        queryBuilder.getMeta()
    ])


    return {
        data,
        meta
    }
}

const getSingleTourType = async (id: string) => {
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

const getSingleTour = async (slug: string) => {
    const tour = await Tour.findOne({ slug })
    return {
        data: tour
    }
}

const getAllTours = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Tour.find(), query)

    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()
    // .build()

    // const meta = await queryBuilder.getMeta()
    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

// const getAllTours = async (query: Record<string, string>) => {
//     const filter = query;
//     const searchTerm = query.searchTerm || "";
//     const sort = query.sort || "-createdAt";
//     const fields = query.fields?.split(",").join(" ") || ""
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 10;
//     const skip = (page - 1) * limit

//     // delete filter["searchTerm"]
//     // delete filter["sort"]


//     for (const field of excludeField) {
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete filter[field]
//     }

//     const searchQuery = {
//         $or: tourSearchableFields.map((field) => (
//             { [field]: { $regex: searchTerm, $options: "i" } }
//         ))
//     }

//     // way - 01

//     // const tours = await Tour
//     //     .find(searchQuery).
//     //     find(filter)
//     // .sort(sort)
//     // .select(fields)
//     // .skip(skip)
//     // .limit(limit);

//     // way - 02

//     const filterQuery = Tour.find(filter)
//     const searchData = filterQuery.find(searchQuery)
//     const tours = await searchData
//         .sort(sort)
//         .select(fields)
//         .skip(skip)
//         .limit(limit);

//     const totalTours = await Tour.countDocuments()

//     const totalPage = Math.ceil(totalTours / limit)

//     const meta = {
//         page: page,
//         limit: limit,
//         total: totalTours,
//         totalPage
//     }

//     return {
//         data: tours,
//         meta
//     }
// }

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id)
    if (!existingTour) throw new Error("Tour not found.")

    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images]
    }

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))

        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImages.includes(imageUrl))

        payload.images = [...restDBImages, ...updatedPayloadImages]
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        await Promise.all(payload.deleteImages.map(url => deleteImageFromCloudinary(url)))
    }

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
    getSingleTourType,
    updateTourType,
    deleteTourType,
    createTour,
    getSingleTour,
    getAllTours,
    updateTour,
    deleteTour
}
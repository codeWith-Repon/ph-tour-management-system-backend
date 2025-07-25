import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";

const createTourType = catchAsync(async (req: Request, res: Response) => {
    const result = await tourService.createTourType(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour type created successfully",
        data: result
    })
})

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await tourService.getAllTourTypes(query as Record<string, string>)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await tourService.updateTourType(id, req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type updated successfully",
        data: result,
    })
})

const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await tourService.getSingleTourType(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type reterived successfully",
        data: result,
    })
})

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await tourService.deleteTourType(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type deleted successfully",
        data: result,
    })
})



const createTour = catchAsync(async (req: Request, res: Response) => {

    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }
    const result = await tourService.createTour(payload)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour created successfully",
        data: result
    })
})

const getAllTours = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await tourService.getAllTours(query as Record<string, string>)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await tourService.getSingleTour(slug)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour retrieved successfully",
        data: result
    })
})

const updateTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const payload: ITour = {
        ...req.body,
        images: ((req.files as Express.Multer.File[]).map(file => file.path))
    }
    const result = await tourService.updateTour(id, payload)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour updated successfully",
        data: result
    })
})

const deleteTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await tourService.deleteTour(id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour deleted successfully",
        data: result
    })
})



export const TourController = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    getSingleTourType,
    deleteTourType,
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour
}
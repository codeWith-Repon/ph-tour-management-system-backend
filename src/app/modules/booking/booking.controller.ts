import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(
    async (req: Request, res: Response) => {
        const decodeToken = req.user as JwtPayload
        const bookings = await BookingService.createBooking(req.body, decodeToken.userId);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Booking created successfully",
            data: bookings
        })
    })

const getUserBookings = catchAsync(
    async (req: Request, res: Response) => {
        const bookings = await BookingService.getUserBookings();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking retrived successfully",
            data: bookings
        })
    })


const getSingleBooking = catchAsync(
    async (req: Request, res: Response) => {
        const bookings = await BookingService.getBookingById();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking retrived successfully",
            data: bookings
        })
    })

const getAllBookings = catchAsync(
    async (req: Request, res: Response) => {
        const bookings = await BookingService.getAllBookings();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking retrived successfully",
            data: bookings
        })
    })


const updateBookingStatus = catchAsync(
    async (req: Request, res: Response) => {
        const updated = await BookingService.updateBookingStatus();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking Status Updated Successfully",
            data: updated
        })
    })



export const BookingController = {
    createBooking,
    getUserBookings,
    getSingleBooking,
    getAllBookings,
    updateBookingStatus
}
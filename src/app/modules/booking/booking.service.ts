/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import httpstatus from "http-status"
import { Booking } from "./booking.model"
import { Payment } from "../payment/paymentModel"
import { PAYMENT_STATUS } from "../payment/paymentInterface"
import { Tour } from "../tour/tour.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"


const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId()

    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const user = await User.findById(userId)

        if (!user?.phone || !user.address) {
            throw new AppError(httpstatus.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
        }

        const tour = await Tour.findById(payload.tour).select("costForm")

        if (!tour?.costForm) {
            throw new AppError(httpstatus.BAD_REQUEST, "No Tour Cost Found!")
        }

        const amount = Number(tour.costForm) * Number(payload.guestCount)

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session })

        const payment = await Payment.create([
            {
                booking: booking[0]._id,
                transactionId: transactionId,
                status: PAYMENT_STATUS.UNPAID,
                amount: amount
            }
        ], { session })

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costForm")
            .populate("payment")

        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userPhoneNumber = (updatedBooking?.user as any).phone
        const userName = (updatedBooking?.user as any).userName

        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayload)

        await session.commitTransaction();
        session.endSession()

        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking
        }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌❌
        throw error
    }
}

const getUserBookings = async () => {

    return {}
}

const getBookingById = async () => {

    return {}
}

const updateBookingStatus = async () => {

    return {}
}
const getAllBookings = async () => {

    return {}
}



export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    getAllBookings,
    updateBookingStatus
}
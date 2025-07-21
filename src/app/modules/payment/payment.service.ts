import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "./paymentInterface"
import { Payment } from "./paymentModel"

const successPayment = async (query: Record<string, string>) => {
    //Update Booking Status to Confirm
    //Update payment Status to Paid

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({
            transactionId: query.transactionId
        }, {
            status: PAYMENT_STATUS.PAID
        }, { new: true, runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()

        return {
            success: true,
            message: "Payment Completed Successfully"
        }

    } catch (error) {
        await session.abortTransaction() // rollback
        session.endSession()
        throw error
    }
}

const failPayment = async (query: Record<string, string>) => {
    //Update Booking Status to fail
    //Update payment Status to fail

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.FAILED },
            { runValidators: true, session: session }
        )

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            )

        await session.commitTransaction() //transaction
        session.endSession()

        return {
            success: false, message: "Payment Failed"
        }

    } catch (error) {
        await session.abortTransaction() // rollback
        session.endSession()
        throw error
    }
}

const cancelPayment = async (query: Record<string, string>) => {
    //Update Booking Status to cancel
    //Update payment Status to cancel

    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.CANCELLED },
            { runValidators: true, session: session }
        )

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BOOKING_STATUS.CANCEL },
            { runValidators: true, session }
        )

        await session.commitTransaction(); //transaction
        session.endSession();
        return { success: false, message: "Payment Cancelled" }

    } catch (error) {
        await session.abortTransaction() // rollback
        session.endSession()
        throw error
    }
}

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment
}
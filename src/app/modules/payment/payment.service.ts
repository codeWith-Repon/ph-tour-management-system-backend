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
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID
        }, { new: true, runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costForm")
            .populate("payment")

        await session.commitTransaction();
        session.endSession()

        return {
            success: true,
            message: "Payment Completed Successfully"
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const failPayment = async () => {
    //Update Booking Status to fail
    //Update payment Status to fail
}

const cancelPayment = async () => {
    //Update Booking Status to cancel
    //Update payment Status to cancel
}

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment
}
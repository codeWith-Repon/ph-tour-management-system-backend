/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStaus from "http-status";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.createUser(req.body)

    res.status(httpStaus.CREATED).json({
        message: "User Created Successfully",
        user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await UserServices.getAllUsers()

    res.status(httpStaus.OK).json({
        success: true,
        message: "All Users Retrieved successfylly",
        data: users
    })
}
)
export const UserControllers = {
    createUser,
    getAllUsers
}
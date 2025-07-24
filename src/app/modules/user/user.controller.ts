/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStaus from "http-status";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.createUser(req.body)

    // res.status(httpStaus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStaus.CREATED,
        message: "User Created Successfully",
        data: user
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user

    const payload = req.body

    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStaus.CREATED,
        message: "User Updated Successfully",
        data: user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query
    const result = await UserServices.getAllUsers(query as Record<string, string>)

    // res.status(httpStaus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved successfylly",
    //     data: users
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStaus.CREATED,
        message: "All Users Retrieved successfylly",
        data: result.data,
        meta: result.meta
    })
}
)

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params
    const result = await UserServices.getSingleUser(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStaus.CREATED,
        message: "Users Retrieved successfylly",
        data: result.data,
    })
}
)


export const UserControllers = {
    createUser,
    updateUser,
    getAllUsers,
    getSingleUser
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStaus from "http-status";
import { UserServices } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    try {
        const user = await UserServices.createUser(req.body)

        res.status(httpStaus.CREATED).json({
            message: "User Created Successfully",
            user
        })
    } catch (error: any) {
        console.log(error);
        res.status(httpStaus.BAD_REQUEST).json({
            message: `Something Went Wrong!! ${error.message}`,
            error
        })
    }
}

export const UserControllers = {
    createUser
}
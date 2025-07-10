/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStaus from "http-status";
import { UserServices } from "./user.service";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserServices.createUser(req.body)

        res.status(httpStaus.CREATED).json({
            message: "User Created Successfully",
            user
        })
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
        next(error)
    }
}

export const UserControllers = {
    createUser
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStaus from "http-status";
import { User } from "./user.model";


const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;

        const user = await User.create({
            name,
            email
        })

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
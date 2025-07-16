/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = "Something Went Wrong!!"
    const errorSources: any = [
        // {
        //     path: "isDeleted",
        //     message: "Cast Failed"
        // }
    ]

    // duplicate error
    if (err.code === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchedArray[1]} already exists!!`
    }
    // cast error or invalid Objectid
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid MongoDB objectID. Please provide a valid id"
    }
    // zod validation error
    else if(err.name === "ZodError") {
          statusCode = 400;
          message = "zod error"
          err.issues.forEach((issue: any) => {
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message
            })
          })
    }
    /// mongoose validationError
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors)
        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        message = 'Validation Error'
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}
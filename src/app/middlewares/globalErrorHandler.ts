/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import { handleDuplicateError } from "../helpers/handleDuplicateError"
import { hanldeCastError } from "../helpers/handleCastError"
import { handleZodError } from "../helpers/handleZodError"
import { handleValidationError } from "../helpers/handleValidationError"
import { TErrorSources } from "../interfaces/error.types"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = "Something Went Wrong!!"
    let errorSources: TErrorSources[] = [
        // {
        //     path: "isDeleted",
        //     message: "Cast Failed"
        // }
    ]

    // duplicate error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // cast error or invalid Objectid
    else if (err.name === "CastError") {
        const simplifiedError = hanldeCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // zod validation error
    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    /// mongoose validationError
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
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
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}
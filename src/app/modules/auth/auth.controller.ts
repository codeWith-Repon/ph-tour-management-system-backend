/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { AuthSerices } from './auth.service'

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthSerices.credentialsLogin(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Loged In Successfully",
        data: loginInfo
    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.headers.authorization
    const tokenInfo = await AuthSerices.getNewAccessToken(refreshToken as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Loged In Successfully",
        data: tokenInfo
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}
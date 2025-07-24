/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { AuthSerices } from './auth.service'
import AppError from '../../errorHelpers/AppError'
import { setAuthCookie } from '../../utils/setCookie'
import { createUserToken } from '../../utils/userToken'
import { envVars } from '../../config/env'
import { JwtPayload } from 'jsonwebtoken'
import passport from 'passport'

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const loginInfo = await AuthSerices.credentialsLogin(req.body)

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        // console.log(user, "👾👾👾👾😀")
        if (err) {
            // ❌❌❌❌
            // throw new AppError(401, err)
            // return new AppError(401, err)
            // next(err)
            // console.log("form err")
            // ✅✅✅✅
            // return err
            return next(new AppError(401, err))
        }

        if (!user) {
            // console.log("form user")
            return next(new AppError(401, info.message))
        }

        const userToken = await createUserToken(user)

        // delete user.toObject().password

        const { password: pass, ...rest } = user.toObject()

        setAuthCookie(res, rest)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Loged In Successfully",
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest
            }
        })
    })(req, res, next)

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }

    const tokenInfo = await AuthSerices.getNewAccessToken(refreshToken)

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo
    })
})

const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Log Out Successfully",
        data: null
    })
})

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword
    const decodedToken = req.user;

    await AuthSerices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword
    const decodedToken = req.user;

    await AuthSerices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null
    })
})

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload;
    const { password } = req.body

    await AuthSerices.setPassword(decodedToken.userId, password)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Set Successfully",
        data: null
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking, => "/" => ""

    const user = req.user

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserToken(user)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null
    // })

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut,
    changePassword,
    resetPassword,
    setPassword,
    googleCallbackController
}
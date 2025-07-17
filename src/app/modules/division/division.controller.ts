import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";


const createDivision = catchAsync(async (req: Request, res: Response) => {
   
    const result = await DivisionService.createDivision(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result
    })
})


export const DivisionController = {
    createDivision
}
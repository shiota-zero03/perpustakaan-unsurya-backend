import { Response } from "express"

const successResponse = (res: Response, data: any, message: string = "Success", code: number = 200) => {
    res.status(code).json({
        success: true,
        message,
        data,
    });
}

const errorResponse = (res: Response, errors: any, message: string = "Success", code: number = 400) => {
    res.status(code).json({
        success: false,
        message,
        errors,
    });
}

export { successResponse, errorResponse }
import { NextFunction, Request, Response } from "express";
import { getTokenFromHeader } from "../../../utils/get-token";
import { errorResponse, successResponse } from "../../../utils/response";
import { getProfileService } from "../services";
import { CustomError } from "../../../errors";

const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            return errorResponse(res, {}, "Token tidak ditemukan", 400);
        }

        const data = await getProfileService(token);

		return successResponse(res, data, "Logout berhasil dilakukan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

export { getProfile };
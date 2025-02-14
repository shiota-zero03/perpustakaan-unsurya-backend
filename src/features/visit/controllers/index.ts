import { Request, Response, NextFunction } from "express";
import { createVisitService } from "../services";
import { errorResponse, successResponse } from "../../../utils/response";
import { visitValidation } from "../validations";
import { CustomError } from "../../../errors";
import { VisitReq } from "src/types/request/Visit.interface";

const createVisitController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { error } = visitValidation.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan valdasi, silahkan cek kembali form anda", 422);
        }

		const request: VisitReq = {
			member: req.body.member,
			activity: req.body.activity
		};

		const data = await createVisitService(request);
		return successResponse(res, data, "Berhasil melakukan kunjungan", 201);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

export { createVisitController };
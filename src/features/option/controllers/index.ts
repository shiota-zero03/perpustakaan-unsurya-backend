import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../errors";
import { errorResponse, successResponse } from "../../../utils/response";
import { getOptionDepartmentService, getOptionFacultyService } from "../services";

const getOptionFaculty = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const data = await getOptionFacultyService();

		return successResponse(res, data, "Data Fakultas berhasil didapatkan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const getOptionDepartment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const { facultyId } = req.query;

        const queryData: { facultyId?: string | null } = {};

        if (facultyId) queryData.facultyId = facultyId as string;

        const data = await getOptionDepartmentService(queryData);

		return successResponse(res, data, "Data program studi berhasil didapatkan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

export { getOptionFaculty, getOptionDepartment }
import { Request, Response, NextFunction } from "express";
import { LoginReq, RegisterReq, ResetReq } from "../../../types/request/Register.inteface";
import { forgotPasswordService, loginService, logoutService, refreshTokenService, registerService, resetPasswordService } from "../services";
import { errorResponse, successResponse } from "../../../utils/response";
import { getTokenFromHeader } from "../../../utils/get-token";
import { forgotValidation, loginValidation, refreshValidation, registerValidation, resetValidation } from "../validations";
import { CustomError } from "../../../errors";

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { error } = registerValidation.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan valdasi, silahkan cek kembali form anda", 422);
        }

		const request: RegisterReq = {
			name: req.body.name,
			email: req.body.email,
			identityNumber: req.body.identityNumber,
			password: req.body.password,
			role: req.body.accountType,
		};
		const data = await registerService(request);
		return successResponse(res, data, "Pengguna berhasil dibuat", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { error } = loginValidation.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan valdasi, silahkan cek kembali form anda", 422);
        }

		const request: LoginReq = {
			email: req.body.email,
			password: req.body.password
		};
		const data = await loginService(request);

		return successResponse(res, data, "Anda berhasil masuk ke dalam sistem", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const refreshTokenUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { error } = refreshValidation.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan valdasi, silahkan cek kembali form anda", 422);
        }

		const data = await refreshTokenService(req.body.refreshToken);

		return successResponse(res, data, "Refresh token berhasil digunakan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = forgotValidation.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan valdasi, silahkan cek kembali form anda", 422);
        }

        const data = await forgotPasswordService(req.body.email);

		return successResponse(res, data, "Link untuk melakukan reset password berhasil dikirim, silahkan cek email anda", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = resetValidation.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan valdasi, silahkan cek kembali form anda", 422);
        }

        const { email, token, new_password, confirmation_password } = req.body;

        if (new_password !== confirmation_password) {
            const errorMessages = {
                confirmation_password: "Konfirmasi tidak sama dengan password baru anda"
            }
            return errorResponse(res, errorMessages, "Kesalahan valdasi, silahkan cek kembali form anda", 422);
        }

        const request: ResetReq = {
            email:  email,
            token:  token,
            new_password:  new_password,
            confirmation_password:  confirmation_password
        }


        const data = await resetPasswordService(request);

		return successResponse(res, data, "Password anda berhasil diperbarui", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(400).json({ message: "Token tidak ditemukan" });
        }

        const data = await logoutService(token);

		return successResponse(res, data, "Logout berhasil dilakukan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

export { registerUser, loginUser, refreshTokenUser, forgotPassword, resetPassword, logoutUser };
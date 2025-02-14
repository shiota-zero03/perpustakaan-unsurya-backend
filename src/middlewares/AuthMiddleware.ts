import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt-utils";
import { errorResponse } from "../utils/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse(res, null, "Unauthorized", 401); // Respons langsung
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyToken(token, "access");

        const getToken = await prisma.authToken.findFirst({
            where: {
                accessToken: token,
            },
        });

        if (!getToken) {
            return errorResponse(res, null, "Unauthorized", 403); // Respons langsung
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id }
        });

        if (!user) {
            return errorResponse(res, null, "Unauthorized", 403); // Respons langsung
        }

        (req as any).user = payload; // Simpan payload di request untuk akses di endpoint
        next();
    } catch (err) {
        return errorResponse(res, null, "Unauthorized", 401); // Tangani error JWT
    }
};

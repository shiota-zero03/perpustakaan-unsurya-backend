import { PrismaClient } from "@prisma/client";
import { CustomError } from "../../../errors";
import { GetProfileInterface } from "../../../types/responses/Profile.interface";
import { verifyToken } from "../../../utils/jwt-utils";

const prisma = new PrismaClient();

export const getProfileService = async (token: string): Promise<any> => {
    const decoded = verifyToken(token, "access");

    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
            admin: true,
            teacher: true,
            student: {
                include: {
                    faculty: true,
                    studyProgram: true,
                },
            }
        },
    });

    if (!user) {
        throw new CustomError("User tidak ditemukan atau token tidak valid", 404);
    }

    let payloadUser: GetProfileInterface = {
        id: user.id,
        user_id: user.userId,
        name: user.name,
        email: user.email,
        identity_number: user.identityNumber,
        status: user.status
    }

    switch (decoded.role) {
        case 'SuperAdmin':
            payloadUser = {
                ...payloadUser,
                profile: user.admin.length > 0 ? user.admin[0] : null, // Tambahkan data admin
            };
            break;
        case 'Admin':
            payloadUser = {
                ...payloadUser,
                profile: user.admin.length > 0 ? user.admin[0] : null, // Tambahkan data admin
            };
            break;
        default:
            break;
    }

    return payloadUser;
};
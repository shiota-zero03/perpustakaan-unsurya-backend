import { Prisma, PrismaClient } from "@prisma/client";
import { CustomError } from "../../../errors";
import { VisitReq } from "../../../types/request/Visit.interface";
import { getTimeZone } from "../../../utils/date-format";

const prisma = new PrismaClient();

const userSelect: Prisma.VisitorSelect = {
    id: true,
    userId: true,
    name: true,
    activity: true
};

export const createVisitService = async (data: VisitReq): Promise<any> => {
    let userId = null;
    let userName = null;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.member },
                { identityNumber: data.member },
            ],
        },
    });
      
    if (existingUser) {
        userId = existingUser.id;
        userName = existingUser.name;
    } else {
        throw new CustomError("Member tidak ditemukan", 404, {});
    }


    const now = new Date();

    const setTimeZone = getTimeZone('Asia/Jakarta', now)

    const existingVisitor = await prisma.visitor.findFirst({
    where: {
        AND: [
        { userId: userId },
        { date: { gte: setTimeZone['startOfDay'], lte: setTimeZone['endOfDay'] } }, // Cek range waktu dalam hari yang sama
        ],
    },
    });

    if (existingVisitor) {
        throw new CustomError("Anda telah melakukan kunjungan hari ini", 400, {});
    }

	const transaction = await prisma.$transaction(async () => {
		const visitorCreate = await prisma.visitor.create({
			data: {
				userId: userId,
                name: userName,
                activity: data.activity,
                date: setTimeZone['startOfDay'],
                time: setTimeZone['timeZone']
			},
			select: userSelect,
		});

        await prisma.notification.create({
            data: {
                type: 'visitor',
                content: `${visitorCreate.name} telah melakukan kunjungan`,
                transactionId: visitorCreate.id
            }
        })

		return visitorCreate;
	});

    return {
        name: transaction.name,
        activity: transaction.activity,
    };
};

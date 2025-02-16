import { Prisma, PrismaClient } from "@prisma/client";
import { CustomError } from "../../../errors";
import { VisitReq } from "../../../types/request/Visit.interface";
import { getTimeZone } from "../../../utils/date-format";

const prisma = new PrismaClient();

interface queryGetListDataVisitor {
    page?: number;
    limit?: number;
    identityNumber?: string;
    name?: string;
    date?: string;
}

const userSelect: Prisma.VisitorSelect = {
    id: true,
    userId: true,
    name: true,
    activity: true
};

export const createVisitService = async (data: VisitReq): Promise<any> => {
    let userId = null;
    let userName = null;

    const existingUser = await prisma.user.findUnique({
        where: {
            identityNumber: data.member,
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
                date: setTimeZone['timeZone'].replace('+07:00', '+00:00'),
                time: setTimeZone['timeZone'].replace('+07:00', '+00:00')
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

export const getVisitService = async ({
    page = 1,
    limit = 10,
    identityNumber,
    name,
    date
}: queryGetListDataVisitor): Promise<any> => {

    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (identityNumber) whereClause.user = {identityNumber: { contains: identityNumber }};
    if (name) whereClause.name = { contains: name };
    if (date) {
        const now = new Date(date);
        const setTimeZone = getTimeZone('Asia/Jakarta', now)
        whereClause.date = { gte: setTimeZone['startOfDay'], lte: setTimeZone['endOfDay'] }
    };

    const [getAllVisitor, totalVisitors] = await prisma.$transaction([
        prisma.visitor.findMany({
            where: whereClause,
            skip: offset,
            take: limit,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            include: {
                user: true,
            },
        }),
        prisma.visitor.count({ where: whereClause }),
    ]);

    const formattedVisitors = getAllVisitor.map(visit => ({
        id: visit.id,
        member: visit.user?.identityNumber,
        name: visit.name,
        activity: visit.activity,
        time: visit.date.toISOString().split('T')[0]
    }));

    const from = formattedVisitors.length > 0 ? ((page - 1) * limit + 1) : 0;
    const to = formattedVisitors.length > 0 ? Math.min(page * limit, totalVisitors) : 0;

    return {
        data: formattedVisitors,
        pagination: {
            from,
            to,
            currentPage: page,
            totalPages: Math.ceil(totalVisitors / limit),
            totalItems: totalVisitors,
            limit,
        },
    };
};

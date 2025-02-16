import { Prisma, PrismaClient } from "@prisma/client";
import { dataSelectionInterface, formInterface, modalDetailDataPetugas, modalListDataPetugas, queryGetListDataPetugas } from "../interface";
import { getTimeZone } from "../../../utils/date-format";
import { saveBase64File } from "../../../utils/base64Handler";
import { CustomError } from "../../../errors";
import { hashedContent } from "../../../utils/bcrypt";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { importBase64ExcelFile } from "../../../utils/base64Handler";

const prisma = new PrismaClient();

const userSelect: Prisma.UserSelect = {
    id: true,
    userId: true,
    email: true,
    name: true,
    password: true,
    role: true
};

export const getAllPetugasService = async ({
    page = 1,
    limit = 10,
    name,
    email,
    status,
}: queryGetListDataPetugas): Promise<any> => {

    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (name) whereClause.name = { contains: name };
    if (email) whereClause.email = { contains: email };
    if (status) whereClause.status = status;
    whereClause.role = "Admin";

    const [getAllAdmins, totalAdmins] = await prisma.$transaction([
        prisma.user.findMany({
            where: whereClause,
            skip: offset,
            take: limit,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            include: {
                admin: true,
            },
        }),
        prisma.user.count({ where: whereClause }),
    ]);

    const formattedPetugas: modalListDataPetugas[] = getAllAdmins.map(user => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        nim: user.identityNumber,
        status: user.status === 'Active' ? 'Aktif' : (user.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: user.createdAt ? user.createdAt.toISOString() : null,
    }));

    const from = formattedPetugas.length > 0 ? ((page - 1) * limit + 1) : 0;
    const to = formattedPetugas.length > 0 ? Math.min(page * limit, totalAdmins) : 0;

    return {
        data: formattedPetugas,
        pagination: {
            from,
            to,
            currentPage: page,
            totalPages: Math.ceil(totalAdmins / limit),
            totalItems: totalAdmins,
            limit,
        },
    };
};

export const storeActionSelected = async (data: dataSelectionInterface): Promise<any> => {
    const now = new Date();
    const setTimeZone = getTimeZone("Asia/Jakarta", now);

    await prisma.$transaction(async (prisma) => {
        for (const item of data.selectedId) {
            const checkUser = await prisma.user.findUnique({ where: { userId: item } });
            if (!checkUser) continue;

            if (data.action === "activated") {
                await prisma.user.update({
                    where: { userId: item },
                    data: {
                        status: "Active",
                        verifiedAt: setTimeZone["timeZone"],
                    },
                });
            } else if (data.action === "non-activated") {
                await prisma.user.update({
                    where: { userId: item },
                    data: { status: "InActive" },
                });
            } else if (data.action === "deleted") {
                await prisma.user.delete({ where: { userId: item } });
            }
        }
    });

    return true;
};

export const deletedPetugasService = async ({ userId }: { userId: string }): Promise<any> => {
    const checkUser = await prisma.user.findUnique({ where: { userId } });

    if (!checkUser) {
        throw new CustomError("Petugas tidak ditemukan", 404, {});
    }

    await prisma.$transaction(async (prisma) => {
        await prisma.user.delete({ where: { userId } });
    });

    return true;
};

export const storePetugasService = async (data: formInterface): Promise<any> => {
    const existingUserByEmail = await prisma.user.findUnique({ where: { email: data.email || "" } });
    if (existingUserByEmail) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { email: "Email sudah digunakan" });

    let profilePicture = null;

    if (data.profilePicture) {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');

        const name = `${data.name}_${formattedDate}_${formattedTime}`;
        const uploadDir = path.join(__dirname, "../../../uploads/images");
        const database64 = saveBase64File(["image/png", "image/jpg", "image/jpeg"], data.profilePicture, name, uploadDir, 5);

        if (database64.success === false) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { profilePicture: database64.message });

        profilePicture = database64.filePath;
    }

    const now = new Date();
    const setTimeZone = getTimeZone('Asia/Jakarta', now)

    try {
        const transaction = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    userId: uuidv4(),
                    email: data.email || "",
                    name: data.name || "",
                    password: await hashedContent(data.password || ""),
                    role: 'Admin',
                    status: data.status === 'Active' ? 'Active' : 'InActive',
                    verifiedAt: setTimeZone['timeZone'] 
                },
                select: userSelect,
            });

            await prisma.admin.create({
                data: {
                    userId: user.id,
                    profilePicture: profilePicture,
                    gender: data.gender || null,
                    position: data.position
                },
            });

            return user;
        });

        return {
            userId: transaction.userId,
            email: transaction.email,
            name: transaction.name,
            accountType: 'Petugas',
        };
    } catch (error) {
        console.error("Error saat melakukan transaksi:", error);
        throw new CustomError("Terjadi kesalahan saat menyimpan data. Tidak ada perubahan yang disimpan.", 500);
    }
};

export const getDetailPetugasService = async ({ userId }: { userId: string }): Promise<any> => {

    const getUser = await prisma.user.findUnique({ 
        where: { userId },
        include: {
            admin: true
        }
    });

    if (!getUser) {
        throw new CustomError("Petugas tidak ditemukan", 404, {});
    }

    const formattedPetugas: modalDetailDataPetugas = {
        id: getUser.userId,
        name: getUser.name,
        email: getUser.email,
        status: getUser.status === 'Active' ? 'Aktif' : (getUser.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: getUser.createdAt ? getUser.createdAt.toISOString() : null,
        gender: getUser.admin[0].gender || null,
        position: getUser.admin[0].position || null,
        profile_picture: getUser.admin[0].profilePicture || null
    };

    return formattedPetugas;
};

export const updatePetugasService = async (data: formInterface, userId: string): Promise<any> => {
    const getUser = await prisma.user.findUnique({ 
        where: { userId },
        include: {
            admin: true
        }
    });

    if (!getUser) {
        throw new CustomError("Petugas tidak ditemukan", 404, {});
    }

    if(data && data.email !== getUser.email) {
        const existingUserByEmail = await prisma.user.findUnique({ where: { email: data.email || "" } });
        if (existingUserByEmail) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { email: "Email sudah digunakan" });
    }

    let profilePicture: string | null | undefined = getUser.admin[0].profilePicture || null;

    if (data.profilePicture) {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');

        const name = `${data.name}_${formattedDate}_${formattedTime}`;
        const uploadDir = path.join(__dirname, "../../../uploads/images");
        const database64 = saveBase64File(["image/png", "image/jpg", "image/jpeg"], data.profilePicture, name, uploadDir, 5);

        if (database64.success === false) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { profilePicture: database64.message });

        profilePicture = database64.filePath;
    }

    const now = new Date();
    const setTimeZone = getTimeZone('Asia/Jakarta', now)

    try {
        const transaction = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.update({
                where: {
                    userId: userId
                },
                data: {
                    userId: uuidv4(),
                    email: data.email || "",
                    name: data.name || "",
                    password: data.password ? await hashedContent(data.password || "") : getUser.password,
                    role: 'Admin',
                    status: data.status === 'Active' ? 'Active' : 'InActive',
                    verifiedAt: setTimeZone['timeZone'] 
                },
                select: userSelect,
            });

            await prisma.admin.update({
                where: {
                    userId: getUser.id
                },
                data: {
                    profilePicture: profilePicture,
                    gender: data.gender || null,
                    position: data.position || null,
                },
            });

            return user;
        });

        return {
            userId: transaction.userId,
            email: transaction.email,
            name: transaction.name,
            accountType: 'Petugas',
        };
    } catch (error) {
        console.error("Error saat melakukan transaksi:", error);
        throw new CustomError("Terjadi kesalahan saat menyimpan data. Tidak ada perubahan yang disimpan.", 500);
    }
};

export const getAllPetugasExportService = async (): Promise<any> => {

    const whereClause: any = {};
    whereClause.role = "Admin";

    const [getAllAdmins] = await prisma.$transaction([
        prisma.user.findMany({
            where: whereClause,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            include: {
                admin: true,
            },
        }),
        prisma.user.count({ where: whereClause }),
    ]);

    const formattedPetugas: modalListDataPetugas[] = getAllAdmins.map(user => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        gender: user.admin[0].gender,
        position: user.admin[0].position,
        status: user.status === 'Active' ? 'Aktif' : (user.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: user.createdAt ? user.createdAt.toISOString() : null,
    }));

    return {
        formattedPetugas
    };
};

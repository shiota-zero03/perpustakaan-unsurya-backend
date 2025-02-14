import { Prisma, PrismaClient } from "@prisma/client";
import { dataSelectionInterface, formInterface, modalDetailDataDosen, modalListDataDosen, queryGetListDataDosen } from "../interface";
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

export const getAllDosenService = async ({
    page = 1,
    limit = 10,
    name,
    nidn,
    status,
}: queryGetListDataDosen): Promise<any> => {

    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (name) whereClause.name = { contains: name };
    if (nidn) whereClause.identityNumber = { contains: nidn };
    if (status) whereClause.status = status;
    whereClause.role = "Teacher";

    const [getAllTeacher, totalTeachers] = await prisma.$transaction([
        prisma.user.findMany({
            where: whereClause,
            skip: offset,
            take: limit,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            include: {
                teacher: true,
            },
        }),
        prisma.user.count({ where: whereClause }),
    ]);

    const formattedTeachers: modalListDataDosen[] = getAllTeacher.map(user => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        nidn: user.identityNumber,
        status: user.status === 'Active' ? 'Aktif' : (user.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: user.createdAt ? user.createdAt.toISOString() : null,
    }));

    const from = formattedTeachers.length > 0 ? ((page - 1) * limit + 1) : 0;
    const to = formattedTeachers.length > 0 ? Math.min(page * limit, totalTeachers) : 0;

    return {
        data: formattedTeachers,
        pagination: {
            from,
            to,
            currentPage: page,
            totalPages: Math.ceil(totalTeachers / limit),
            totalItems: totalTeachers,
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

export const deletedDosenService = async ({ userId }: { userId: string }): Promise<any> => {
    const checkUser = await prisma.user.findUnique({ where: { userId } });

    if (!checkUser) {
        throw new CustomError("Dosen tidak ditemukan", 404, {});
    }

    await prisma.$transaction(async (prisma) => {
        await prisma.user.delete({ where: { userId } });
    });

    return true;
};

export const storeDosenService = async (data: formInterface): Promise<any> => {
    const existingUserByEmail = await prisma.user.findUnique({ where: { email: data.email || "" } });
    if (existingUserByEmail) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { email: "Email sudah digunakan" });

    const existingUserByIdentityNumber = await prisma.user.findUnique({ where: { identityNumber: data.nidn || "" } });
    if (existingUserByIdentityNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { nidn: "Nomor identitas sudah digunakan" });

    const existingUserByPhoneNumber = await prisma.teacher.findUnique({ where: { phoneNumber: data.phoneNumber || "" } });
    if (existingUserByPhoneNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { phoneNumber: "Nomor telepon sudah digunakan" });

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

    let validUntil = null;
    if (data.validUntil) {
        const date = new Date(data.validUntil);
        if (!isNaN(date.getTime())) {
            validUntil = date.toISOString(); // Jika validUntil valid, ubah ke ISO string
        } else {
            throw new CustomError("Masa berlakuk tidak valid", 422, { validUntil: "Tanggal tidak valid" });
        }
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
                    role: 'Teacher',
                    identityNumber: data.nidn || "",
                    status: data.status === 'Active' ? 'Active' : 'InActive',
                    verifiedAt: setTimeZone['timeZone'] 
                },
                select: userSelect,
            });

            await prisma.teacher.create({
                data: {
                    userId: user.id,
                    profilePicture: profilePicture,
                    gender: data.gender || null,
                    phoneNumber: data.phoneNumber || null,
                    validUntil: validUntil,
                },
            });

            return user;
        });

        return {
            userId: transaction.userId,
            email: transaction.email,
            name: transaction.name,
            accountType: 'Dosen',
        };
    } catch (error) {
        console.error("Error saat melakukan transaksi:", error);
        throw new CustomError("Terjadi kesalahan saat menyimpan data. Tidak ada perubahan yang disimpan.", 500);
    }
};

export const getDetailDosenService = async ({ userId }: { userId: string }): Promise<any> => {

    const getUser = await prisma.user.findUnique({ 
        where: { userId },
        include: {
            teacher: true
        }
    });

    if (!getUser) {
        throw new CustomError("Dosen tidak ditemukan", 404, {});
    }

    const formattedTeachers: modalDetailDataDosen = {
        id: getUser.userId,
        name: getUser.name,
        email: getUser.email,
        nidn: getUser.identityNumber,
        status: getUser.status === 'Active' ? 'Aktif' : (getUser.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: getUser.createdAt ? getUser.createdAt.toISOString() : null,
        gender: getUser.teacher[0].gender || null,
        phone_number: getUser.teacher[0].phoneNumber || null,
        valid_until: getUser.teacher[0].validUntil ? getUser.teacher[0].validUntil.toISOString() : null,
        profile_picture: getUser.teacher[0].profilePicture || null
    };

    return formattedTeachers;
};

export const updateDosenService = async (data: formInterface, userId: string): Promise<any> => {
    const getUser = await prisma.user.findUnique({ 
        where: { userId },
        include: {
            teacher: true
        }
    });

    if (!getUser) {
        throw new CustomError("Dosen tidak ditemukan", 404, {});
    }

    if(data && data.email !== getUser.email) {
        const existingUserByEmail = await prisma.user.findUnique({ where: { email: data.email || "" } });
        if (existingUserByEmail) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { email: "Email sudah digunakan" });
    }
    if(data && data.nidn !== getUser.identityNumber) {
        const existingUserByIdentityNumber = await prisma.user.findUnique({ where: { identityNumber: data.nidn || "" } });
        if (existingUserByIdentityNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { nidn: "Nomor identitas sudah digunakan" });
    }
    if(data && data.phoneNumber !== getUser.teacher[0].phoneNumber) {
        const existingUserByPhoneNumber = await prisma.teacher.findUnique({ where: { phoneNumber: data.phoneNumber || "" } });
        if (existingUserByPhoneNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { phoneNumber: "Nomor telepon sudah digunakan" });
    }

    let profilePicture: string | null | undefined = getUser.teacher[0].profilePicture || null;

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

    let validUntil = null;
    if (data.validUntil) {
        const date = new Date(data.validUntil);
        if (!isNaN(date.getTime())) {
            validUntil = date.toISOString(); // Jika validUntil valid, ubah ke ISO string
        } else {
            throw new CustomError("Masa berlakuk tidak valid", 422, { validUntil: "Tanggal tidak valid" });
        }
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
                    role: 'Teacher',
                    identityNumber: data.nidn || "",
                    status: data.status === 'Active' ? 'Active' : 'InActive',
                    verifiedAt: setTimeZone['timeZone'] 
                },
                select: userSelect,
            });

            await prisma.teacher.update({
                where: {
                    userId: getUser.id
                },
                data: {
                    profilePicture: profilePicture,
                    gender: data.gender || null,
                    phoneNumber: data.phoneNumber || null,
                    validUntil: validUntil,
                },
            });

            return user;
        });

        return {
            userId: transaction.userId,
            email: transaction.email,
            name: transaction.name,
            accountType: 'Dosen',
        };
    } catch (error) {
        console.error("Error saat melakukan transaksi:", error);
        throw new CustomError("Terjadi kesalahan saat menyimpan data. Tidak ada perubahan yang disimpan.", 500);
    }
};

export const getAllDosenExportService = async (): Promise<any> => {

    const whereClause: any = {};
    whereClause.role = "Teacher";

    const [getAllTeacher] = await prisma.$transaction([
        prisma.user.findMany({
            where: whereClause,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            include: {
                teacher: true,
            },
        }),
        prisma.user.count({ where: whereClause }),
    ]);

    const formattedTeachers: modalListDataDosen[] = getAllTeacher.map(user => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        gender: user.teacher[0].gender,
        phone: user.teacher[0].phoneNumber,
        nidn: user.identityNumber,
        status: user.status === 'Active' ? 'Aktif' : (user.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: user.createdAt ? user.createdAt.toISOString() : null,
    }));

    return {
        formattedTeachers
    };
};

export const importDosenService = async (dataImport: string): Promise<any> => {
    
    const dataForImport = await importBase64ExcelFile(dataImport);
    if (dataForImport.success === false) throw new CustomError(dataForImport.message, 422);

    const now = new Date();
    const dataExecute = dataForImport.data;

    const dataErrors: any[] = [];

    const setTimeZone = getTimeZone('Asia/Jakarta', now)
    for (const item of dataExecute) {
        const existingUserByEmail = await prisma.user.findUnique({ where: { email: item['Email'] || "" } });
        if (existingUserByEmail) {
            dataErrors.push(item['Email']);
            continue;
        }

        const existingUserByIdentityNumber = await prisma.user.findUnique({ where: { identityNumber: item['NIDN'] || "" } });
        const existingUserByPhoneNumber = await prisma.teacher.findUnique({ where: { phoneNumber: item['No. Hp'] || "" } });
        const nidn = existingUserByIdentityNumber ? null : item['NIDN'];
        const phone = existingUserByPhoneNumber ? null : item['No. Hp'];

        const date = new Date();
        date.setFullYear(date.getFullYear() + 5);
        const validUntil = date.toISOString();


        try {
            const transaction = await prisma.$transaction(async (prisma) => {
                const user = await prisma.user.create({
                    data: {
                        userId: uuidv4(),
                        email: item['Email'] || "",
                        name: item['Nama'] || "",
                        password: await hashedContent(item['Password'] || "123456"),
                        role: 'Teacher',
                        identityNumber: nidn,
                        status: 'Active',
                        verifiedAt: setTimeZone['timeZone'],
                    },
                    select: userSelect,
                });

                await prisma.teacher.create({
                    data: {
                        userId: user.id,
                        profilePicture: null,
                        gender: item['Jenis Kelamin (L/P)'] || null,
                        phoneNumber: phone,
                        validUntil: validUntil,
                    },
                });

                return user;
            });

            continue;
        } catch (error) {
            console.error("Error saat melakukan transaksi:", error);
            throw new CustomError("Terjadi kesalahan saat menyimpan data. Tidak ada perubahan yang disimpan.", 500);
        }

    }

    return [
        null,
        `Data berhasil diimport (${dataErrors.length > 0 ? 'email: ' + dataErrors.join(", ") + ' tidak berhasil diimport karena data sudah ada' : 'semua data berhasil diimport'})`
    ];
};
import { Prisma, PrismaClient } from "@prisma/client";
import { dataSelectionInterface, formInterface, modalDetailDataMahasiswa, modalListDataMahasiswa, queryGetListDataMahasiswa } from "../interface";
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

export const getAllMahasiswaService = async ({
    page = 1,
    limit = 10,
    name,
    nim,
    status,
}: queryGetListDataMahasiswa): Promise<any> => {

    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (name) whereClause.name = { contains: name };
    if (nim) whereClause.identityNumber = { contains: nim };
    if (status) whereClause.status = status;
    whereClause.role = "Student";

    const [getAllStudents, totalStudents] = await prisma.$transaction([
        prisma.user.findMany({
            where: whereClause,
            skip: offset,
            take: limit,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            include: {
                student: true,
            },
        }),
        prisma.user.count({ where: whereClause }),
    ]);

    const formattedStudents: modalListDataMahasiswa[] = getAllStudents.map(user => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        nim: user.identityNumber,
        status: user.status === 'Active' ? 'Aktif' : (user.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: user.createdAt ? user.createdAt.toISOString() : null,
    }));

    const from = formattedStudents.length > 0 ? ((page - 1) * limit + 1) : 0;
    const to = formattedStudents.length > 0 ? Math.min(page * limit, totalStudents) : 0;

    return {
        data: formattedStudents,
        pagination: {
            from,
            to,
            currentPage: page,
            totalPages: Math.ceil(totalStudents / limit),
            totalItems: totalStudents,
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

export const deletedMahasiswaService = async ({ userId }: { userId: string }): Promise<any> => {
    const checkUser = await prisma.user.findUnique({ where: { userId } });

    if (!checkUser) {
        throw new CustomError("Mahasiswa tidak ditemukan", 404, {});
    }

    await prisma.$transaction(async (prisma) => {
        await prisma.user.delete({ where: { userId } });
    });

    return true;
};

export const storeMahasiswaService = async (data: formInterface): Promise<any> => {
    const existingUserByEmail = await prisma.user.findUnique({ where: { email: data.email || "" } });
    if (existingUserByEmail) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { email: "Email sudah digunakan" });

    const existingUserByIdentityNumber = await prisma.user.findUnique({ where: { identityNumber: data.nim || "" } });
    if (existingUserByIdentityNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { nim: "Nomor identitas sudah digunakan" });

    const existingUserByPhoneNumber = await prisma.student.findUnique({ where: { phoneNumber: data.phoneNumber || "" } });
    if (existingUserByPhoneNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { phoneNumber: "Nomor telepon sudah digunakan" });

    const facultyCheck = await prisma.faculty.findUnique({ where: { id: data.faculty || 0 } });
    if (!facultyCheck) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { faculty: `Fakultas dengan id ${data.faculty} tidak ditemukan` });

    const prodyCheck = await prisma.studyProgram.findUnique({ where: { id: data.department || 0 } });    
    if (!prodyCheck) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { department: `Program studi dengan id ${data.department} tidak ditemukan` });

    if(prodyCheck.facultyId !== facultyCheck.id) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { department: `Program studi dengan id ${data.department} tidak cocok dengan fakultas dengan id ${data.faculty}` });

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
                    role: 'Student',
                    identityNumber: data.nim || "",
                    status: data.status === 'Active' ? 'Active' : 'InActive',
                    verifiedAt: setTimeZone['timeZone'] 
                },
                select: userSelect,
            });

            await prisma.student.create({
                data: {
                    userId: user.id,
                    profilePicture: profilePicture,
                    gender: data.gender || null,
                    facultyId: data.faculty,
                    studyProgramId: data.department,
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
            accountType: 'Mahasiswa',
        };
    } catch (error) {
        console.error("Error saat melakukan transaksi:", error);
        throw new CustomError("Terjadi kesalahan saat menyimpan data. Tidak ada perubahan yang disimpan.", 500);
    }
};

export const getDetailMahasiswaService = async ({ userId }: { userId: string }): Promise<any> => {

    const getUser = await prisma.user.findUnique({ 
        where: { userId },
        include: {
            student: {
                include: {
                    faculty: true,
                    studyProgram: true
                }
            }
        }
    });

    if (!getUser) {
        throw new CustomError("Mahasiswa tidak ditemukan", 404, {});
    }

    const formattedStudents: modalDetailDataMahasiswa = {
        id: getUser.userId,
        name: getUser.name,
        email: getUser.email,
        nim: getUser.identityNumber,
        status: getUser.status === 'Active' ? 'Aktif' : (getUser.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: getUser.createdAt ? getUser.createdAt.toISOString() : null,
        gender: getUser.student[0].gender || null,
        phone_number: getUser.student[0].phoneNumber || null,
        faculty: getUser.student[0].faculty ? {
            id: getUser.student[0].faculty.id,
            name: getUser.student[0].faculty.name,
        } : null,
        department: getUser.student[0].studyProgram ? {
            id: getUser.student[0].studyProgram.id,
            name: getUser.student[0].studyProgram.name,
        } : null,
        valid_until: getUser.student[0].validUntil ? getUser.student[0].validUntil.toISOString() : null,
        profile_picture: getUser.student[0].profilePicture || null
    };

    return formattedStudents;
};

export const updateMahasiswaService = async (data: formInterface, userId: string): Promise<any> => {
    const getUser = await prisma.user.findUnique({ 
        where: { userId },
        include: {
            student: true
        }
    });

    if (!getUser) {
        throw new CustomError("Mahasiswa tidak ditemukan", 404, {});
    }

    if(data && data.email !== getUser.email) {
        const existingUserByEmail = await prisma.user.findUnique({ where: { email: data.email || "" } });
        if (existingUserByEmail) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { email: "Email sudah digunakan" });
    }
    if(data && data.nim !== getUser.identityNumber) {
        const existingUserByIdentityNumber = await prisma.user.findUnique({ where: { identityNumber: data.nim || "" } });
        if (existingUserByIdentityNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { nim: "Nomor identitas sudah digunakan" });
    }
    if(data && data.phoneNumber !== getUser.student[0].phoneNumber) {
        const existingUserByPhoneNumber = await prisma.student.findUnique({ where: { phoneNumber: data.phoneNumber || "" } });
        if (existingUserByPhoneNumber) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { phoneNumber: "Nomor telepon sudah digunakan" });
    }

    const facultyCheck = await prisma.faculty.findUnique({ where: { id: data.faculty || 0 } });
    if (!facultyCheck) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { faculty: `Fakultas dengan id ${data.faculty} tidak ditemukan` });

    const prodyCheck = await prisma.studyProgram.findUnique({ where: { id: data.department || 0 } });    
    if (!prodyCheck) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { department: `Program studi dengan id ${data.department} tidak ditemukan` });

    if(prodyCheck.facultyId !== facultyCheck.id) throw new CustomError("Kesalahan validasi, silahkan cek kembali form anda", 422, { department: `Program studi dengan id ${data.department} tidak cocok dengan fakultas dengan id ${data.faculty}` });
    let profilePicture: string | null | undefined = getUser.student[0].profilePicture || null;

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
                    role: 'Student',
                    identityNumber: data.nim || "",
                    status: data.status === 'Active' ? 'Active' : 'InActive',
                    verifiedAt: setTimeZone['timeZone'] 
                },
                select: userSelect,
            });

            await prisma.student.update({
                where: {
                    userId: getUser.id
                },
                data: {
                    profilePicture: profilePicture,
                    gender: data.gender || null,
                    phoneNumber: data.phoneNumber || null,
                    facultyId: data.faculty,
                    studyProgramId: data.department,
                    validUntil: validUntil,
                },
            });

            return user;
        });

        return {
            userId: transaction.userId,
            email: transaction.email,
            name: transaction.name,
            accountType: 'Mahasiswa',
        };
    } catch (error) {
        console.error("Error saat melakukan transaksi:", error);
        throw new CustomError("Terjadi kesalahan saat menyimpan data. Tidak ada perubahan yang disimpan.", 500);
    }
};

export const getAllMahasiswaExportService = async (): Promise<any> => {

    const whereClause: any = {};
    whereClause.role = "Student";

    const [getAllStudents] = await prisma.$transaction([
        prisma.user.findMany({
            where: whereClause,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            include: {
                student: {
                    include: {
                        faculty: true,
                        studyProgram: true
                    }
                },
            },
        }),
        prisma.user.count({ where: whereClause }),
    ]);

    const formattedStudents: modalListDataMahasiswa[] = getAllStudents.map(user => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        gender: user.student[0].gender,
        phone: user.student[0].phoneNumber,
        nim: user.identityNumber,
        faculty: user.student[0].faculty?.name,
        department: user.student[0].studyProgram?.name,
        status: user.status === 'Active' ? 'Aktif' : (user.verifiedAt ? 'Tidak Aktif' : 'Belum Diverifikasi'),
        waktu_terdaftar: user.createdAt ? user.createdAt.toISOString() : null,
    }));

    return {
        formattedStudents
    };
};

export const importMahasiswaService = async (dataImport: string): Promise<any> => {
    
    const dataForImport = await importBase64ExcelFile(dataImport);
    if (dataForImport.success === false) throw new CustomError(dataForImport.message, 422);

    const now = new Date();
    const dataExecute = dataForImport.data;

    const dataErrors: any[] = [];

    const setTimeZone = getTimeZone('Asia/Jakarta', now)
    for (const item of dataExecute) {
        const itemNim = item['NIM'] || item['N I M'];
        if(!itemNim) {
            continue;
        }
        const checkNim = String(item['NIM'] || item['N I M'] || "");

        const existingUserByIdentityNumber = await prisma.user.findUnique({ where: { identityNumber: checkNim } });
        if (existingUserByIdentityNumber) {
            dataErrors.push(checkNim);
            continue;
        }

        const email = `${checkNim}@unsurya.ac.id`;
        const password = String(checkNim);

        const itemPhone = String(item['No. Hp'] || item['Telepon'] || item['Phone'] || "");

        const existingUserByPhoneNumber = await prisma.student.findUnique({ where: { phoneNumber: itemPhone } });
        const phone = existingUserByPhoneNumber ? null : itemPhone;

        const date = new Date();
        date.setFullYear(date.getFullYear() + 5);
        const validUntil = date.toISOString();

        const prodiName = item['Program Studi'] || item['PROGRAM STUDI'] || item['PRODI'] || "";
        const programStudyCheck = await prisma.studyProgram.findFirst({
            where: {
                name: { contains: prodiName }
            }
        });

        let department = null;
        let faculty = null;
        if(programStudyCheck) {
            department = programStudyCheck.id;
            faculty = programStudyCheck.facultyId;
        }


        try {
            const transaction = await prisma.$transaction(async (prisma) => {
                const user = await prisma.user.create({
                    data: {
                        userId: uuidv4(),
                        email: email,
                        name: item['Nama'] || item['NAMA'] || item['N A M A'] || "",
                        password: await hashedContent(password),
                        role: 'Student',
                        identityNumber: checkNim,
                        status: 'Active',
                        verifiedAt: setTimeZone['timeZone'],
                    },
                    select: userSelect,
                });

                await prisma.student.create({
                    data: {
                        userId: user.id,
                        profilePicture: null,
                        gender: item['Jenis Kelamin (L/P)'] || item['Jenis Kelamin'] || null,
                        facultyId: faculty,
                        studyProgramId: department,
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
        `Data berhasil diimport (${dataErrors.length > 0 ? 'nim: ' + dataErrors.join(", ") + ' tidak berhasil diimport karena data sudah ada' : 'semua data berhasil diimport'})`
    ];
};
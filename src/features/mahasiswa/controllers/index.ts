import { NextFunction, Request, Response } from "express";

import { errorResponse, successResponse } from "../../../utils/response";
import { deletedMahasiswaService, getAllMahasiswaExportService, getAllMahasiswaService, getDetailMahasiswaService, importMahasiswaService, storeActionSelected, storeMahasiswaService, updateMahasiswaService } from "../services";
import { CustomError } from "../../../errors";
import { dataSelectionInterface, formInterface, modalListDataMahasiswa, queryGetListDataMahasiswa } from "../interface";
import { storeValidation, updateValidation } from "../validations";

import ExcelJS from "exceljs";
import * as fs from "fs";

const getAllMahasiswa = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { limit, page, name, nim, status } = req.query;

        const queryData: queryGetListDataMahasiswa = {};

        if (limit) queryData.limit = Number(limit);
        if (page) queryData.page = Number(page);
        if (name) queryData.name = name as string;
        if (nim) queryData.nim = nim as string;
        if (status) queryData.status = status as string;

        const data = await getAllMahasiswaService(queryData);

		return successResponse(res, data, "Data mahasiswa berhasil didapatkan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const ActionSelected = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const request: dataSelectionInterface = {
            action: req.body.action,
            selectedId: req.body.selectedId
        };

        await storeActionSelected(request);

        return successResponse(res, true, "Data berhasil diperbarui", 200);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const DeletedMahasiswa = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId } = req.params;

        await deletedMahasiswaService({ userId: userId });

        return successResponse(res, true, "Data berhasil dihapus", 200);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const StoreMahasiswa = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { error } = storeValidation.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan validasi, silahkan cek kembali form anda", 422);
        }

        const request: formInterface = {
            profilePicture: req.body.profilePicture,
            name: req.body.name,
            nim: req.body.nim,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            faculty: req.body.faculty,
            department: req.body.department,
            status: req.body.status,
            validUntil: req.body.validUntil,
        };

        const data = await storeMahasiswaService(request);

        return successResponse(res, data, "Data berhasil disimpan", 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const getDetailMahasiswa = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const { userId } = req.params;

        const data = await getDetailMahasiswaService({ userId: userId });

		return successResponse(res, data, "Data mahasiswa berhasil didapatkan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const UpdateMahasiswa = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { error } = updateValidation.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessages: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                errorMessages[field] = detail.message;
            });
            return errorResponse(res, errorMessages, "Kesalahan validasi, silahkan cek kembali form anda", 422);
        }

        const { userId } = req.params;

        const request: formInterface = {
            profilePicture: req.body.profilePicture,
            name: req.body.name,
            nim: req.body.nim,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            faculty: req.body.faculty,
            department: req.body.department,
            status: req.body.status,
            validUntil: req.body.validUntil,
        };

        const data = await updateMahasiswaService(request, userId);

        return successResponse(res, data, "Data berhasil diperbarui", 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const SampleExportMahasiswa = async(_req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const data = [
        { "No": 1, "Nama": "John Doe", "NIDN": "123481231231", "Jenis Kelamin (L/P)": "L", "No. Hp": "081241231312", "Email": "youremail@gmail.com", "Password": "123456" },
        { "No": 2, "Nama": "John Doe", "NIDN": "123481231231", "Jenis Kelamin (L/P)": "L", "No. Hp": "081241231312", "Email": "youremail@gmail.com", "Password": "123456" },
        { "No": 3, "Nama": "John Doe", "NIDN": "123481231231", "Jenis Kelamin (L/P)": "L", "No. Hp": "081241231312", "Email": "youremail@gmail.com", "Password": "123456" },
        { "No": 4, "Nama": "John Doe", "NIDN": "123481231231", "Jenis Kelamin (L/P)": "L", "No. Hp": "081241231312", "Email": "youremail@gmail.com", "Password": "123456" },
        { "No": 5, "Nama": "John Doe", "NIDN": "123481231231", "Jenis Kelamin (L/P)": "L", "No. Hp": "081241231312", "Email": "youremail@gmail.com", "Password": "123456" },
        { "No": 6, "Nama": "John Doe", "NIDN": "123481231231", "Jenis Kelamin (L/P)": "L", "No. Hp": "081241231312", "Email": "youremail@gmail.com", "Password": "123456" },
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerRow = worksheet.addRow(Object.keys(data[0]));
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Bold dan warna teks putih
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "085C94" } }; // Background biru
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });

    data.forEach((row) => {
        const rowData = worksheet.addRow(Object.values(row));
        rowData.eachCell(cell => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
            cell.alignment = { horizontal: "center" };
        });
    });

    worksheet.columns.forEach((column, i) => {
        let maxLength = column.header ? column.header.toString().length : 10; // **Ambil panjang header**
        data.forEach(row => {
        const cellValue = (row as any)[Object.keys(row)[i]];
        if (cellValue) {
            maxLength = Math.max(maxLength, cellValue.toString().length); // **Cari teks terpanjang**
        }
        });
        column.width = maxLength + 5; // **Tambahkan padding biar gak kepotong**
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    const filename = "sample data mahasiswa.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.download(filename, () => {
        fs.unlinkSync(filename); // Hapus setelah di-download
    });
}

const DataImportMahasiswa = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { dataImport } = req.body;
        if (!dataImport) {
            return res.status(400).json({ message: "Base64 file is required" });
        }
        
        const data = await importMahasiswaService(dataImport)
    
        return successResponse(res, data[0], data[1], 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const DataExportMahasiswa = async(_req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const getExport = await getAllMahasiswaExportService();
    const data: {}[] = [];
    getExport['formattedStudents'].map((item: modalListDataMahasiswa, index: number) => {
        const timeRegister = new Date(item.waktu_terdaftar || "");
        data.push({
            "No": index + 1,
            "Nama": item.name,
            "NIM": item.nim,
            "Jenis Kelamin": item.gender,
            "No. Hp": item.phone,
            "Email": item.email,
            "Fakultas": item.faculty,
            "Program Studi": item.department,
            "status": item.status,
            "Waktu Terdaftar": timeRegister.toLocaleString("id-ID")
        })
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerRow = worksheet.addRow(Object.keys(data[0]));
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Bold dan warna teks putih
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "085C94" } }; // Background biru
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });

    data.forEach((row) => {
        const rowData = worksheet.addRow(Object.values(row));
        rowData.eachCell(cell => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
            cell.alignment = { horizontal: "center" };
        });
    });

    worksheet.columns.forEach((column, i) => {
        let maxLength = column.header ? column.header.toString().length : 10; // **Ambil panjang header**
        data.forEach(row => {
        const cellValue = (row as any)[Object.keys(row)[i]];
        if (cellValue) {
            maxLength = Math.max(maxLength, cellValue.toString().length); // **Cari teks terpanjang**
        }
        });
        column.width = maxLength + 5; // **Tambahkan padding biar gak kepotong**
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    const filename = "data mahasiswa.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.download(filename, () => {
        fs.unlinkSync(filename); // Hapus setelah di-download
    });
}

export { getAllMahasiswa, ActionSelected, DeletedMahasiswa, StoreMahasiswa, getDetailMahasiswa, UpdateMahasiswa, SampleExportMahasiswa, DataExportMahasiswa, DataImportMahasiswa };
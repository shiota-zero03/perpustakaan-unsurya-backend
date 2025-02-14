import { NextFunction, Request, Response } from "express";

import { errorResponse, successResponse } from "../../../utils/response";
import { deletedDosenService, getAllDosenExportService, getAllDosenService, getDetailDosenService, importDosenService, storeActionSelected, storeDosenService, updateDosenService } from "../services";
import { CustomError } from "../../../errors";
import { dataSelectionInterface, formInterface, queryGetListDataDosen } from "../interface";
import { storeValidation, updateValidation } from "../validations";

import ExcelJS from "exceljs";
import * as fs from "fs";

const getAllDosen = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { limit, page, name, nidn, status } = req.query;

        const queryData: queryGetListDataDosen = {};

        if (limit) queryData.limit = Number(limit);
        if (page) queryData.page = Number(page);
        if (name) queryData.name = name as string;
        if (nidn) queryData.nidn = nidn as string;
        if (status) queryData.status = status as string;

        const data = await getAllDosenService(queryData);

		return successResponse(res, data, "Data dosen berhasil didapatkan", 200);
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

const DeletedDosen = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId } = req.params;

        await deletedDosenService({ userId: userId });

        return successResponse(res, true, "Data berhasil dihapus", 200);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const StoreDosen = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            nidn: req.body.nidn,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            validUntil: req.body.validUntil,
        };

        const data = await storeDosenService(request);

        return successResponse(res, data, "Data berhasil disimpan", 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const getDetailDosen = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const { userId } = req.params;

        const data = await getDetailDosenService({ userId: userId });

		return successResponse(res, data, "Data dosen berhasil didapatkan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const UpdateDosen = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            nidn: req.body.nidn,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            validUntil: req.body.validUntil,
        };

        const data = await updateDosenService(request, userId);

        return successResponse(res, data, "Data berhasil diperbarui", 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const SampleExportDosen = async(_req: Request, res: Response, _next: NextFunction): Promise<any> => {
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

    const filename = "sample data dosen.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.download(filename, () => {
        fs.unlinkSync(filename); // Hapus setelah di-download
    });
}

const DataImportDosen = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { dataImport } = req.body;
        if (!dataImport) {
            return res.status(400).json({ message: "Base64 file is required" });
        }
        
        const data = await importDosenService(dataImport)
    
        return successResponse(res, data[0], data[1], 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const DataExportDosen = async(_req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const getExport = await getAllDosenExportService();
    const data: {}[] = [];
    getExport['formattedTeachers'].map((item: { name: string; nidn: string; gender: string; phone: string; email: string; status: string; waktu_terdaftar: string; }, index: number) => {
        const timeRegister = new Date(item.waktu_terdaftar);
        data.push({
            "No": index + 1,
            "Nama": item.name,
            "NIDN": item.nidn,
            "Jenis Kelamin": item.gender,
            "No. Hp": item.phone,
            "Email": item.email,
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

    const filename = "data dosen.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.download(filename, () => {
        fs.unlinkSync(filename); // Hapus setelah di-download
    });
}
export { getAllDosen, ActionSelected, DeletedDosen, StoreDosen, getDetailDosen, UpdateDosen, SampleExportDosen, DataExportDosen, DataImportDosen };
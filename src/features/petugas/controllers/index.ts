import { NextFunction, Request, Response } from "express";

import { errorResponse, successResponse } from "../../../utils/response";
import { deletedPetugasService, getAllPetugasExportService, getAllPetugasService, getDetailPetugasService, storeActionSelected, storePetugasService, updatePetugasService } from "../services";
import { CustomError } from "../../../errors";
import { dataSelectionInterface, formInterface, modalListDataPetugas, queryGetListDataPetugas } from "../interface";
import { storeValidation, updateValidation } from "../validations";

import ExcelJS from "exceljs";
import * as fs from "fs";

const getAllPetugas = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { limit, page, name, email, status } = req.query;

        const queryData: queryGetListDataPetugas = {};

        if (limit) queryData.limit = Number(limit);
        if (page) queryData.page = Number(page);
        if (name) queryData.name = name as string;
        if (email) queryData.email = email as string;
        if (status) queryData.status = status as string;

        const data = await getAllPetugasService(queryData);

		return successResponse(res, data, "Data petugas berhasil didapatkan", 200);
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

const DeletedPetugas = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId } = req.params;

        await deletedPetugasService({ userId: userId });

        return successResponse(res, true, "Data berhasil dihapus", 200);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const StorePetugas = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            gender: req.body.gender,
            email: req.body.email,
            password: req.body.password,
            position: req.body.position,
            status: req.body.status,
        };

        const data = await storePetugasService(request);

        return successResponse(res, data, "Data berhasil disimpan", 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const getDetailPetugas = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const { userId } = req.params;

        const data = await getDetailPetugasService({ userId: userId });

		return successResponse(res, data, "Data petugas berhasil didapatkan", 200);
	} catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
	}
}

const UpdatePetugas = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            gender: req.body.gender,
            email: req.body.email,
            password: req.body.password,
            position: req.body.position,
            status: req.body.status,
        };

        const data = await updatePetugasService(request, userId);

        return successResponse(res, data, "Data berhasil diperbarui", 201);
    } catch (error: any) {
        if (error instanceof CustomError) {
            return errorResponse(res, error.data, error.message, error.statusCode);
        }
		next(error);
    }
}

const DataExportPetugas = async(_req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const getExport = await getAllPetugasExportService();
    const data: {}[] = [];
    getExport['formattedPetugas'].map((item: modalListDataPetugas, index: number) => {
        const timeRegister = new Date(item.waktu_terdaftar || "");
        data.push({
            "No": index + 1,
            "Nama": item.name,
            "Jenis Kelamin": item.gender,
            "Email": item.email,
            "Jabatan": item.position,
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

    const filename = "data petugas.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.download(filename, () => {
        fs.unlinkSync(filename); // Hapus setelah di-download
    });
}

export { getAllPetugas, ActionSelected, DeletedPetugas, StorePetugas, getDetailPetugas, UpdatePetugas, DataExportPetugas };
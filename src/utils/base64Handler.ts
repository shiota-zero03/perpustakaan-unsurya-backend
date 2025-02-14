import fs from "fs";
import path from "path";
import ExcelJS from "exceljs"

export const saveBase64File = (
    validationType: string[],
    base64File: string,
    fileName: string,
    uploadDir: string,
    maxSize: number,
): { success: boolean; filePath?: string; message: string } => {
    try {
        const matches = base64File.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
            return { success: false, message: "Invalid Base64 string" };
        }

        const mimeType = matches[1]; // MIME type: "image/png", "application/pdf", dll.
        const base64Data = matches[2]; // Data Base64 tanpa prefix

        if (!validationType.includes(mimeType)) {
            return { success: false, message: `File dengan format ${mimeType} tidak diizinkan` };
        }

        const buffer = Buffer.from(base64Data, "base64");
        const fileSizeInMB = buffer.length / (1024 * 1024); // Ukuran file dalam MB

        if (fileSizeInMB > maxSize) {
            return {
                success: false,
                message: `File terlalu besar. Maximum ukuran file adalah ${maxSize}MB.`,
            };
        }

        let subDir = 'others';  // Default folder
        if (mimeType.startsWith("image/")) {
            subDir = 'images';
        } else if (mimeType === "application/pdf") {
            subDir = 'pdf';
        }

        const extension = mimeType.split("/")[1];
        const filePath = path.join(uploadDir, `${fileName}.${extension}`);

        fs.writeFileSync(filePath, buffer);

        const APP_URL = process.env.APP_URL || "http://localhost:3003";

        const fileUrl = `${APP_URL}/assets/${subDir}/${fileName}.${mimeType.split("/")[1]}`;

        return { success: true, filePath: fileUrl, message: "File saved successfully" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: "An unknown error occurred" };
        }
    }
};


export const importBase64ExcelFile = async (base64File: string): Promise<{ success: boolean; data?: any; message: string; }> => {
    try {
        const matches = base64File.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
            return { success: false, message: "Invalid Base64 string" };
        }

        const buffer = Buffer.from(base64File, "base64");

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer).catch(() => {
            throw new Error("Invalid Excel file");
        });

        const worksheet = workbook.worksheets[0];
        const headers: string[] = [];   

        worksheet.getRow(1).eachCell((cell) => {
            headers.push(cell.value?.toString() || "");
        });

        const data: any[] = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const rowData: any = {};
    
            row.eachCell((cell, colNumber) => {
                const key = headers[colNumber - 1];
                rowData[key] = cell.value;
            });
    
            data.push(rowData);
        });

        return { success: true, data: data, message: "File saved successfully" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: "An unknown error occurred" };
        }
    }
}
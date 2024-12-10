import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';

@Injectable()
export class ExcelService {
    // Convert Excel file to JSON
    async parseExcelFile(file: Express.Multer.File): Promise<any[]> {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        return xlsx.utils.sheet_to_json(worksheet);
    }

    // Generate Excel file from data
    generateExcelFile(data: any[]): Buffer {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'ExportedExcel');
        return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
}
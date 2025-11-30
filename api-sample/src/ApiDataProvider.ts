import * as XLSX from 'xlsx';
import { join } from 'path';

export class ApiDataProvider {
  static readExcel(fileName: string, sheetName = 'Sheet1'): any[] {
    const path = join(process.cwd(), fileName);
    const wb = XLSX.readFile(path);
    const ws = wb.Sheets[sheetName];
    if (!ws) return [];
    return XLSX.utils.sheet_to_json(ws);
  }

  static writeExcel(fileName: string, data: any[], sheetName = 'Sheet1') {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  }
}

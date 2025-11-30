import XLSX from 'xlsx';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

/**
 * DataProvider: Handles data-driven testing from Excel and SQL
 */
export class DataProvider {
  private excelPath: string = './tests/data';
  private sqlConfig?: {
    host: string;
    user: string;
    password: string;
    database: string;
  };

  constructor(excelPath?: string, sqlConfig?: any) {
    if (excelPath) this.excelPath = excelPath;
    if (sqlConfig) this.sqlConfig = sqlConfig;
  }

  /**
   * Read data from Excel file
   */
  async readExcel(fileName: string, sheetName?: string): Promise<any[]> {
    const filePath = path.join(this.excelPath, fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = sheetName ? workbook.Sheets[sheetName] : workbook.Sheets[workbook.SheetNames[0]];
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in ${fileName}`);
    }

    const data: any[] = XLSX.utils.sheet_to_json(sheet);
    return data;
  }

  /**
   * Write data to Excel file
   */
  async writeExcel(fileName: string, data: any[], sheetName: string = 'Sheet1'): Promise<void> {
    const filePath = path.join(this.excelPath, fileName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(this.excelPath)) {
      fs.mkdirSync(this.excelPath, { recursive: true });
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filePath);
  }

  /**
   * Append data to existing Excel sheet
   */
  async appendToExcel(fileName: string, newData: any[], sheetName?: string): Promise<void> {
    const filePath = path.join(this.excelPath, fileName);
    let existingData: any[] = [];

    if (fs.existsSync(filePath)) {
      existingData = await this.readExcel(fileName, sheetName);
    }

    const combinedData = [...existingData, ...newData];
    await this.writeExcel(fileName, combinedData, sheetName || 'Sheet1');
  }

  /**
   * Execute SQL query
   */
  async querySql(query: string): Promise<any[]> {
    if (!this.sqlConfig) {
      throw new Error('SQL configuration not provided');
    }

    const connection = await mysql.createConnection(this.sqlConfig);
    
    try {
      const [results] = await connection.execute(query);
      return results as any[];
    } finally {
      await connection.end();
    }
  }

  /**
   * Execute SQL INSERT/UPDATE/DELETE
   */
  async executeSql(query: string, params?: any[]): Promise<any> {
    if (!this.sqlConfig) {
      throw new Error('SQL configuration not provided');
    }

    const connection = await mysql.createConnection(this.sqlConfig);
    
    try {
      const [result] = await connection.execute(query, params);
      return result;
    } finally {
      await connection.end();
    }
  }

  /**
   * Create test data template in Excel
   */
  async createTestDataTemplate(fileName: string, columns: string[], sheetName: string = 'TestData'): Promise<void> {
    const templateData = [
      Object.fromEntries(columns.map(col => [col, `Sample ${col}`]))
    ];
    await this.writeExcel(fileName, templateData, sheetName);
  }

  /**
   * Filter Excel data by condition
   */
  async filterExcelData(
    fileName: string,
    condition: (row: any) => boolean,
    sheetName?: string
  ): Promise<any[]> {
    const data = await this.readExcel(fileName, sheetName);
    return data.filter(condition);
  }
}

export default DataProvider;

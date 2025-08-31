import fs from 'fs';
import tmp from 'tmp';
import type { Alignment, Borders, Fill, Font } from 'exceljs';
import ExcelJS from 'exceljs';

export const $excelCreateWorkbook = () => {
  try {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Govinius.id';
    workbook.created = new Date();

    return workbook;
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error,
    });
  }
};

export const $excelCreateWorksheet = (options: {
  workbook: ExcelJS.Workbook;
  name: string;
}) => {
  try {
    const worksheet = options.workbook.addWorksheet(options.name);

    return worksheet;
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error,
    });
  }
};

export const $excelWriteFile = async (options: {
  workbook: ExcelJS.Workbook;
}) => {
  try {
    const tmpPath = tmp.fileSync().name;

    await options.workbook.xlsx.write(fs.createWriteStream(tmpPath));

    return tmpPath;
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error,
    });
  }
};

export const $excelReadFile = async (options: {
  file_path: string;
  callback: (sheetName: string, data: any[]) => Promise<void>;
}) => {
  try {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(options.file_path);

    await new Promise((resolve) => {
      const worksheets = workbook.worksheets;

      for (const worksheet of worksheets) {
        const sheetName = worksheet.name;

        worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
          const data = row.values as any[];
          data.splice(0, 1);
          await options.callback(sheetName, data);

          if (worksheet.rowCount === rowNumber) {
            resolve(true);
          }
        });
      }
    });
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error,
    });
  }
};

export const $excelColumnLetter = (index: number) => {
  let letter = '';
  while (index > 0) {
    const remainder = (index - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    index = Math.floor((index - 1) / 26);
  }
  return letter;
};

export const $excelCellStyle = {
  fill: {
    solid: (colorHex: string): Fill => {
      return {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colorHex },
      };
    },
  },
  font: {
    bold: { bold: true } as Partial<Font>,
    color: (colorHex: string): Partial<Font> => {
      return {
        color: { argb: colorHex },
      };
    },
  },
  numFmt: {
    number: '#,##0',
  },
  border: {
    all: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    } as Partial<Borders>,
  },
  alignment: {
    middleLeft: {
      vertical: 'middle',
      horizontal: 'left',
      indent: 1,
      wrapText: true,
    } as Partial<Alignment>,
    middleRight: {
      vertical: 'middle',
      horizontal: 'right',
      indent: 1,
      wrapText: true,
    } as Partial<Alignment>,
  },
};

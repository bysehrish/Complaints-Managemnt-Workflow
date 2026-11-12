import * as XLSX from 'xlsx';
import { CRMComplaint, DataValidationSummary } from '../types/crm';

export const REQUIRED_COLUMNS = [
  'Complaint Number',
  'Logging Date',
  'Closing Date',
  'Aging',
  'Priority',
  'Type',
  'Status',
  'Branch Code',
  'New Region',
  'region_c',
  'Circle',
  'City_c',
  'Product',
  'ComplaintType',
  'Lodgement Source',
  'root_cause_c',
  'decision_box_c',
  'customer_name_c',
  'cnic_c',
  'customer_account_c',
  'description_compaint',
  'Activity_notes',
  'cmu_owner_c',
];

export interface ParseResult {
  data: CRMComplaint[];
  summary: DataValidationSummary;
  error?: string;
}

/**
 * Parses an Excel (.xlsx / .xls) or CSV file and maps to CRMComplaint schema
 */
export async function parseExcelCRMFile(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        data: [],
        summary: {
          totalRows: 0,
          validRows: 0,
          missingColumns: REQUIRED_COLUMNS,
          recognizedColumns: [],
          filename: file.name,
          uploadTimestamp: new Date().toLocaleTimeString(),
        },
        error: 'The uploaded Excel workbook contains no readable sheets.',
      };
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (rawRows.length === 0) {
      return {
        data: [],
        summary: {
          totalRows: 0,
          validRows: 0,
          missingColumns: REQUIRED_COLUMNS,
          recognizedColumns: [],
          filename: file.name,
          uploadTimestamp: new Date().toLocaleTimeString(),
        },
        error: 'The uploaded file contains no data rows.',
      };
    }

    // Inspect first row headers with loose normalization
    const firstRow = rawRows[0];
    const rawHeaders = Object.keys(firstRow);
    const headerMap = new Map<string, string>(); // normalized -> rawKey

    rawHeaders.forEach((key) => {
      const normalized = key.trim().toLowerCase().replace(/[\s_-]+/g, '');
      headerMap.set(normalized, key);
    });

    const recognizedColumns: string[] = [];
    const missingColumns: string[] = [];

    REQUIRED_COLUMNS.forEach((reqCol) => {
      const normalizedReq = reqCol.trim().toLowerCase().replace(/[\s_-]+/g, '');
      if (headerMap.has(normalizedReq)) {
        recognizedColumns.push(reqCol);
      } else {
        missingColumns.push(reqCol);
      }
    });

    // Map each row to CRMComplaint
    const parsedData: CRMComplaint[] = rawRows.map((row, idx) => {
      const getValue = (colName: string): any => {
        const normalized = colName.trim().toLowerCase().replace(/[\s_-]+/g, '');
        const actualKey = headerMap.get(normalized);
        if (actualKey && row[actualKey] !== undefined) {
          const val = row[actualKey];
          if (val instanceof Date) {
            return val.toISOString().slice(0, 10);
          }
          return val;
        }
        return '';
      };

      const complaintNum = String(getValue('Complaint Number') || `CM-${5000 + idx}`);
      const agingRaw = getValue('Aging');
      const aging = typeof agingRaw === 'number' ? agingRaw : parseInt(String(agingRaw), 10) || 1;

      return {
        'Complaint Number': complaintNum,
        'Logging Date': String(getValue('Logging Date') || '2024-08-01'),
        'Closing Date': String(getValue('Closing Date') || ''),
        'Aging': aging,
        'Priority': (getValue('Priority') || 'Medium') as any,
        'Type': String(getValue('Type') || getValue('Product') || 'General'),
        'Status': (getValue('Status') || 'Open') as any,
        'Branch Code': String(getValue('Branch Code') || 'BR-101'),
        'New Region': String(getValue('New Region') || 'Central Metro'),
        'region_c': String(getValue('region_c') || 'Central'),
        'Circle': String(getValue('Circle') || 'Central Circle'),
        'City_c': String(getValue('City_c') || 'Karachi'),
        'Product': String(getValue('Product') || 'Mobile App'),
        'ComplaintType': String(getValue('ComplaintType') || 'General Dispute'),
        'Lodgement Source': String(getValue('Lodgement Source') || 'Mobile App'),
        'root_cause_c': String(getValue('root_cause_c') || 'System Processing Delay'),
        'decision_box_c': String(getValue('decision_box_c') || 'Under Review'),
        'customer_name_c': String(getValue('customer_name_c') || 'Bank Customer'),
        'cnic_c': String(getValue('cnic_c') || '42101-*******-1'),
        'customer_account_c': String(getValue('customer_account_c') || '**** 0000'),
        'description_compaint': String(getValue('description_compaint') || 'Customer logged service complaint'),
        'Activity_notes': String(getValue('Activity_notes') || 'Assigned for investigation'),
        'cmu_owner_c': String(getValue('cmu_owner_c') || 'Operation'),
      };
    });

    return {
      data: parsedData,
      summary: {
        totalRows: rawRows.length,
        validRows: parsedData.length,
        missingColumns,
        recognizedColumns,
        filename: file.name,
        uploadTimestamp: new Date().toLocaleTimeString(),
      },
    };
  } catch (err: any) {
    return {
      data: [],
      summary: {
        totalRows: 0,
        validRows: 0,
        missingColumns: REQUIRED_COLUMNS,
        recognizedColumns: [],
        filename: file.name,
        uploadTimestamp: new Date().toLocaleTimeString(),
      },
      error: `Failed to parse file: ${err.message || 'Unknown format'}`,
    };
  }
}

/**
 * Generates and triggers download of sample raw CRM dataset in .xlsx format
 */
export function downloadSampleCRMExcel(sampleData: CRMComplaint[]) {
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw_CRM_Complaints');

  // Auto-fit column widths
  const colWidths = REQUIRED_COLUMNS.map((col) => ({
    wch: Math.max(col.length + 4, 15),
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, 'Sample_Raw_CRM_Complaints_Template.xlsx');
}

/**
 * Exports current active / filtered data to Excel or CSV
 */
export function exportCRMDataToExcel(data: CRMComplaint[], filename = 'CRM_Complaints_Export.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Complaints_Report');
  XLSX.writeFile(workbook, filename);
}

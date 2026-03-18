import * as XLSX from 'xlsx';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export interface ExcelExportOptions {
  fileName: string;
  sheetName?: string;
  columns: ExcelColumn[];
  data: Record<string, unknown>[];
  title?: string;
  subtitle?: string;
}

/**
 * Exports data to a styled XLSX file and triggers browser download.
 * Uses SheetJS (xlsx) for generation.
 */
export function exportToExcel(options: ExcelExportOptions): void {
  const { fileName, sheetName = 'Sheet1', columns, data, title, subtitle } = options;

  const wb = XLSX.utils.book_new();

  const sheetData: unknown[][] = [];

  // Title rows
  if (title) {
    sheetData.push([title]);
    if (subtitle) sheetData.push([subtitle]);
    sheetData.push(['Generated:', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })]);
    sheetData.push([]);
  }

  // Header row
  sheetData.push(columns.map((c) => c.header));

  // Data rows
  for (const row of data) {
    sheetData.push(columns.map((c) => {
      const val = row[c.key];
      if (val === null || val === undefined) return '';
      if (typeof val === 'boolean') return val ? 'Yes' : 'No';
      return val;
    }));
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Column widths
  const headerRowIndex = title ? (subtitle ? 4 : 3) : 0;
  ws['!cols'] = columns.map((c) => ({ wch: c.width ?? Math.max(c.header.length + 4, 14) }));

  // Merge title cell across all columns
  if (title) {
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } }];
  }

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// --- Pre-built export helpers ---

export function exportStudentsToExcel(students: Record<string, unknown>[]): void {
  exportToExcel({
    fileName: `students-${todaySlug()}`,
    sheetName: 'Students',
    title: 'Scope School — Student List',
    subtitle: `Academic Year 2024–2025`,
    columns: [
      { header: 'Student Code', key: 'code', width: 16 },
      { header: 'First Name', key: 'firstName', width: 18 },
      { header: 'Last Name', key: 'lastName', width: 18 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Payment Status', key: 'paymentStatus', width: 16 },
      { header: 'Enrollment Date', key: 'enrollmentDate', width: 18 },
    ],
    data: students,
  });
}

export function exportTeachersToExcel(teachers: Record<string, unknown>[]): void {
  exportToExcel({
    fileName: `teachers-${todaySlug()}`,
    sheetName: 'Teachers',
    title: 'Scope School — Teacher Directory',
    subtitle: `Exported: ${new Date().toLocaleDateString()}`,
    columns: [
      { header: 'Employee Code', key: 'code', width: 16 },
      { header: 'First Name', key: 'firstName', width: 18 },
      { header: 'Last Name', key: 'lastName', width: 18 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Specialization', key: 'specialization', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Hire Date', key: 'hireDate', width: 14 },
      { header: 'Classes', key: 'classes', width: 20 },
    ],
    data: teachers,
  });
}

export function exportAttendanceToExcel(records: Record<string, unknown>[], date: string): void {
  exportToExcel({
    fileName: `attendance-${date}`,
    sheetName: 'Attendance',
    title: `Scope School — Attendance Register`,
    subtitle: `Date: ${date}`,
    columns: [
      { header: 'Student Name', key: 'name', width: 24 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Note', key: 'note', width: 30 },
    ],
    data: records,
  });
}

export function exportGradesToExcel(grades: Record<string, unknown>[]): void {
  exportToExcel({
    fileName: `grades-${todaySlug()}`,
    sheetName: 'Grades',
    title: 'Scope School — Grade Report',
    subtitle: `Exported: ${new Date().toLocaleDateString()}`,
    columns: [
      { header: 'Student', key: 'student', width: 24 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Subject', key: 'subject', width: 18 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Max Score', key: 'maxScore', width: 12 },
      { header: 'Percentage', key: 'percentage', width: 14 },
      { header: 'Grade', key: 'grade', width: 10 },
      { header: 'Teacher', key: 'teacher', width: 22 },
      { header: 'Term', key: 'term', width: 10 },
    ],
    data: grades,
  });
}

export function exportPaymentsToExcel(payments: Record<string, unknown>[]): void {
  exportToExcel({
    fileName: `payments-${todaySlug()}`,
    sheetName: 'Payments',
    title: 'Scope School — Payment Records',
    subtitle: `Exported: ${new Date().toLocaleDateString()}`,
    columns: [
      { header: 'Student', key: 'student', width: 24 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Fee Type', key: 'feeType', width: 18 },
      { header: 'Amount ($)', key: 'amount', width: 14 },
      { header: 'Paid ($)', key: 'paid', width: 12 },
      { header: 'Balance ($)', key: 'balance', width: 14 },
      { header: 'Due Date', key: 'dueDate', width: 14 },
      { header: 'Paid Date', key: 'paidDate', width: 14 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Method', key: 'method', width: 16 },
    ],
    data: payments,
  });
}

export function exportSalariesToExcel(salaries: Record<string, unknown>[]): void {
  exportToExcel({
    fileName: `salaries-${todaySlug()}`,
    sheetName: 'Salaries',
    title: 'Scope School — Teacher Salary Records',
    subtitle: `Exported: ${new Date().toLocaleDateString()}`,
    columns: [
      { header: 'Teacher', key: 'teacher', width: 24 },
      { header: 'Month', key: 'month', width: 16 },
      { header: 'Amount ($)', key: 'amount', width: 14 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Paid Date', key: 'paidDate', width: 14 },
    ],
    data: salaries,
  });
}

function todaySlug(): string {
  return new Date().toISOString().slice(0, 10);
}

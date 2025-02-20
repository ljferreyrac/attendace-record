export interface EmployeeResponse {
  document_id: string;
  full_name: string;
  position: string;
  department: string;
  hire_date: string;
  max_scan_number: number;
  work_hours: number;
}

export interface Employee {
  documentId: string;
  fullName: string;
  position: string;
  department: string;
  hireDate: string;
  maxScanNumber: number;
  workHours: number;
}

export interface APIResponse {
  status: "success" | "error";
  data?: EmployeeResponse;
  error?: string;
}

export interface AttendanceResponse {
  document_id: string;
  full_name: string;
  position: string;
  department: string;
  hire_date: string;
  scan_date: string;
  first_scan: string | null;
  second_scan: string | null;
  third_scan: string | null;
  last_scan: string | null;
  work_hours: number | null;
  extra_hours: number | null;
}

export interface Attendance {
  documentId: string;
  fullName: string;
  position: string;
  department: string;
  hireDate: string;
  scanDate: string;
  firstScan: string | null;
  secondScan: string | null;
  thirdScan: string | null;
  lastScan: string | null;
  workHours: number | string;
  extraHours: number | string;
}

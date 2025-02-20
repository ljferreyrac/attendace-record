import {
  VITE_CLOUDFLARE_WORKER_URL,
  VITE_CLOUDFLARE_API_TOKEN,
  VITE_GOOGLE_API_URL,
} from "../config";
import type { APIResponse, AttendanceResponse } from "../types/employee";

export const getEmployeeById = async (
  document_id: string
): Promise<APIResponse> => {
  try {
    const response = await fetch(
      `${VITE_GOOGLE_API_URL}?document_id=${document_id}`
    );
    const data: APIResponse = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      error: "Error al conectar con el servidor",
    };
  }
};

export const getLastScanNumber = async (documentId: string, date: string) => {
  const response = await fetch(
    `${VITE_CLOUDFLARE_WORKER_URL}/api/last-scan-number?documentId=${documentId}&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${VITE_CLOUDFLARE_API_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data.lastScanNumber;
};

export const insertScanRecord = async (scanData: {
  documentId: string;
  fullName: string;
  position: string;
  department: string;
  hireDate: string;
  scanDate: string;
  scanTime: string;
  scanNumber: number;
  maxScanNumber: number;
  workHours: number;
}) => {
  const response = await fetch(
    `${VITE_CLOUDFLARE_WORKER_URL}/api/insert-scan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VITE_CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify(scanData),
    }
  );
  return response.json();
};

export const getAttendances = async (
  startDate: string,
  endDate: string,
  documentId?: string
): Promise<AttendanceResponse[]> => {
  const url = new URL(`${VITE_CLOUDFLARE_WORKER_URL}/api/attendances`);
  url.searchParams.append("startDate", startDate);
  url.searchParams.append("endDate", endDate);
  if (documentId) {
    url.searchParams.append("documentId", documentId);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${VITE_CLOUDFLARE_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching attendances");
  }

  return response.json();
};

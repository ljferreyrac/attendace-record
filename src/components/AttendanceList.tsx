import React from "react";
import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { getAttendances } from "../utils/queries";
import type { Attendance } from "../types/employee";
import * as XLSX from "xlsx";
import { Search, Download, Calendar, User, Sunrise } from "lucide-react";
import { formatToDisplayDate } from "../utils/timeConverter";

const AttendanceList: React.FC = () => {
  const getLocalDate = () => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - timezoneOffset);
    return localDate.toISOString().split("T")[0];
  };

  const today = getLocalDate();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [employeeId, setEmployeeId] = useState<string>();
  const [workAtDawn, setWorkAtDawn] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  console.log(workAtDawn);

  const fetchAttendances = useCallback(async () => {
    try {
      const attendanceReponse = await getAttendances(
        startDate,
        endDate,
        workAtDawn,
        employeeId || undefined
      );

      const data = attendanceReponse.map((attendance) => ({
        documentId: attendance.document_id,
        fullName: attendance.full_name,
        position: attendance.position,
        department: attendance.department,
        hireDate: formatToDisplayDate(attendance.hire_date),
        scanDate: formatToDisplayDate(attendance.scan_date),
        firstScan: attendance.first_scan,
        secondScan: attendance.second_scan,
        thirdScan: attendance.third_scan,
        lastScan: attendance.last_scan,
        workHours: attendance.work_hours || "-",
        extraHours: attendance.extra_hours || "-",
      }));

      setAttendances(data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    }
  }, [employeeId, endDate, startDate, workAtDawn]);

  const columns = useMemo<ColumnDef<Attendance>[]>(
    () => [
      {
        header: "DNI",
        accessorKey: "documentId",
      },
      {
        header: "Apellidos y Nombres",
        accessorKey: "fullName",
      },
      {
        header: "Puesto",
        accessorKey: "position",
      },
      {
        header: "Área",
        accessorKey: "department",
      },
      {
        header: "Fec. Ing",
        accessorKey: "hireDate",
      },
      {
        header: "Fecha",
        accessorKey: "scanDate",
      },
      {
        header: "Hora de Entrada",
        accessorKey: "firstScan",
      },
      {
        header: "Salida a Refrigerio",
        accessorKey: "secondScan",
      },
      {
        header: "Retorno de Refrigerio",
        accessorKey: "thirdScan",
      },
      {
        header: "Hora de Salida",
        accessorKey: "lastScan",
      },
      {
        header: "Horas trabajadas",
        accessorKey: "workHours",
      },
      {
        header: "Horas extras",
        accessorKey: "extraHours",
      },
    ],
    []
  );

  const table = useReactTable({
    data: attendances,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportToExcel = () => {
    const headersMap: Record<string, string> = {
      documentId: "DNI",
      fullName: "Apellidos y Nombres",
      position: "Puesto",
      department: "Área",
      hireDate: "Fec. Ing",
      scanDate: "Fecha",
      firstScan: "Hora de Entrada",
      secondScan: "Salida a Refrigerio",
      thirdScan: "Retorno de Refrigerio",
      lastScan: "Hora de Salida",
      workHours: "Horas Trabajadas",
      extraHours: "Horas extras",
    };

    const dataToExport = table.getFilteredRowModel().rows.map((row) => {
      const rowData = { ...row.original };
      if (rowData.scanDate) {
        const date = new Date(rowData.scanDate);
        rowData.scanDate = date.toLocaleDateString("es-PE", {
          timeZone: "America/Lima",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
      const transformedRow: Record<string, string | number | null> = {};
      (Object.keys(rowData) as Array<keyof typeof rowData>).forEach((key) => {
        const newKey = headersMap[key];
        if (newKey) {
          transformedRow[newKey] = rowData[key];
        }
      });

      return transformedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");
    XLSX.writeFile(workbook, `Asistencia.xlsx`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Lista de Asistencias
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="DNI del empleado"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAttendances}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Search size={20} />
            Buscar
          </button>
          {attendances.length > 0 && (
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <Download size={20} />
              Exportar
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div className="flex items-center mr-6">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={workAtDawn}
                onChange={(e) => setWorkAtDawn(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block ${
                  workAtDawn ? "bg-blue-200" : "bg-gray-200"
                } w-14 h-8 rounded-full`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${
                  workAtDawn
                    ? "transform translate-x-6 bg-blue-600"
                    : "bg-white"
                }`}
              ></div>
            </div>
            <div className="ml-3 flex items-center text-gray-700 font-medium">
              <Sunrise size={20} className="mr-2 text-amber-500" />
              Trabajo al amanecer
            </div>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar en todos los campos..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="group">
                    <div
                      className="h-14 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 flex items-center"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2 whitespace-normal">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="text-gray-400">
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                    </div>
                    <div className="h-12 px-6 py-2 border-t border-gray-200">
                      <input
                        type="text"
                        value={(header.column.getFilterValue() as string) ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        placeholder={`Filtrar ${header.column.columnDef.header}`}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron registros
        </div>
      )}
    </div>
  );
};

export default AttendanceList;

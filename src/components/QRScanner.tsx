import type React from "react";
import { useState, useCallback } from "react";
import {
  getEmployeeById,
  getLastScanNumber,
  insertScanRecord,
} from "../utils/queries";
import { QrCode, UserCheck, RefreshCw, AlertCircle } from "lucide-react";
import Html5QrcodePlugin from "./Html5QrcodePlugin";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Employee } from "../types/employee";
import Loader from "./Loader";
import {
  formatToDatabaseDate,
  formatToDisplayDate,
  getUTCMinus5Date,
} from "../utils/timeConverter";

const QRScanner: React.FC = () => {
  const [scannedEmployee, setScannedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [scannedTime, setScannedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  let errorCount = 0;

  const handleScanSuccess = async (decodedText: string) => {
    try {
      setLoading(true);
      const response = await getEmployeeById(decodedText);

      if (response.status === "success" && response.data) {
        const now = getUTCMinus5Date(new Date());
        const currentDate = formatToDatabaseDate(
          now.toLocaleDateString("es-PE", {
            timeZone: "America/Lima",
          })
        );

        const { lastScanNumber, workAtDawn } = await getLastScanNumber(
          response.data.document_id,
          response.data.work_at_dawn,
          currentDate
        );

        let newScanNumber = lastScanNumber + 1;
        if (lastScanNumber >= response.data.max_scan_number) {
          if (!workAtDawn) {
            setError("Ya alcanzó el número máximo de escaneos para hoy");
            setScannedEmployee(null);
            return;
          }
          newScanNumber = 1;
        }

        const hireDate = formatToDatabaseDate(
          formatToDisplayDate(response.data.hire_date.split("T")[0])
        );

        await insertScanRecord({
          documentId: response.data.document_id,
          fullName: response.data.full_name,
          position: response.data.position,
          department: response.data.department,
          hireDate,
          scanDate: currentDate,
          scanTime: now.toLocaleTimeString("es-PE", {
            timeZone: "America/Lima",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          scanNumber: newScanNumber,
          maxScanNumber: response.data.max_scan_number,
          workHours: response.data.work_hours,
          workAtDawn: response.data.work_at_dawn,
        });

        setScannedEmployee({
          documentId: response.data.document_id,
          fullName: response.data.full_name,
          position: response.data.position,
          department: response.data.department,
          hireDate,
          maxScanNumber: response.data.max_scan_number,
          workHours: response.data.work_hours,
        });

        setScannedTime(
          `${now.toLocaleDateString("es-PE", {
            timeZone: "America/Lima",
          })} ${now.toLocaleTimeString("es-PE", {
            timeZone: "America/Lima",
          })}`
        );
        setError(null);

        setIsScanning(false);
      } else {
        setError(response.error || "Empleado no encontrado");
        setScannedEmployee(null);
      }
    } catch (error) {
      console.error(error);
      setError("Error al procesar el escaneo");
      setScannedEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (
    errorMessage: string,
    scanner: Html5QrcodeScanner
  ) => {
    console.warn("Error de escaneo:", errorMessage);
    const match = errorMessage.match(/error\s*=\s*([a-zA-Z_]+):/);
    errorCount++;
    if (errorCount >= 20 && match && match[1] === "IndexSizeError") {
      scanner.clear().catch((error) => console.log(error));
      errorCount = 0;
    }
  };

  const resetScanner = useCallback(() => {
    setScannedEmployee(null);
    setScannedTime(null);
    setError(null);
    setIsScanning(true);
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <QrCode className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Escanear QR de Empleado
          </h1>
        </div>

        {loading && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Loader />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Coloque el código QR frente a la cámara para escanear
            </p>
          </div>
        )}

        {isScanning && !error && !loading && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={handleScanSuccess}
                qrCodeErrorCallback={handleScanError}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Coloque el código QR frente a la cámara para escanear
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={resetScanner}
              className="mt-3 inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar nuevamente
            </button>
          </div>
        )}

        {scannedEmployee && !loading && (
          <div className="bg-green-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 text-green-700 mb-2">
              <UserCheck className="h-6 w-6" />
              <h2 className="text-lg font-semibold">¡Asistencia Registrada!</h2>
            </div>

            <div className="space-y-2">
              {[
                ["Apellidos y Nombres", scannedEmployee.fullName],
                ["DNI", scannedEmployee.documentId],
                ["Puesto", scannedEmployee.position],
                ["Area", scannedEmployee.department],
                ["Hora Registrada", scannedTime],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-green-200"
                >
                  <span className="text-green-600 font-medium">{label}:</span>
                  <span className="text-green-700">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={resetScanner}
              className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Escanear Otro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

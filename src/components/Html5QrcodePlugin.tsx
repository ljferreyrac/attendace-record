import type React from "react";
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import type { Html5QrcodeResult } from "html5-qrcode";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (
    decodedText: string,
    decodedResult: Html5QrcodeResult
  ) => void;
  qrCodeErrorCallback?: (
    errorMessage: string,
    scanner: Html5QrcodeScanner
  ) => void;
}

const qrcodeRegionId = "reader";

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = ({
  fps = 10,
  qrbox = 250,
  aspectRatio = 1.0,
  disableFlip = false,
  verbose = false,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        qrcodeRegionId,
        {
          fps,
          qrbox,
          aspectRatio,
          disableFlip,
          videoConstraints: { facingMode: { exact: "environment" } },
        },
        verbose
      );
    }

    const scanner = scannerRef.current;
    scanner.render(qrCodeSuccessCallback, (errorMessage: string) =>
      qrCodeErrorCallback!(errorMessage, scanner)
    );

    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Error limpiando el escáner:", error));
    };
  }, []);

  return (
    <div id={qrcodeRegionId} style={{ width: "100%", minHeight: "300px" }} />
  );
};

export default Html5QrcodePlugin;

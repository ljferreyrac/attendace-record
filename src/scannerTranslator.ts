function scannerTranslator() {
  const translates = [
    {
      original: "QR code parse error, error =",
      traduction: "Error al analizar el código QR, error =",
    },
    {
      original: "Error getting userMedia, error =",
      traduction: "Error al obtener userMedia, error =",
    },
    {
      original:
        "The device doesn't support navigator.mediaDevices , only supported cameraIdOrConfig in this case is deviceId parameter (string).",
      traduction:
        "El dispositivo no admite navigator.mediaDevices, en este caso sólo se admite cameraIdOrConfig como parámetro deviceId (cadena).",
    },
    {
      original: "Camera streaming not supported by the browser.",
      traduction: "El navegador no admite la transmisión de la cámara.",
    },
    {
      original: "Unable to query supported devices, unknown error.",
      traduction:
        "No se puede consultar los dispositivos compatibles, error desconocido.",
    },
    {
      original:
        "Camera access is only supported in secure context like https or localhost.",
      traduction:
        "El acceso a la cámara sólo es compatible en un contexto seguro como https o localhost.",
    },
    { original: "Scanner paused", traduction: "Escáner en pausa" },

    { original: "Scanning", traduction: "Escaneando" },
    { original: "Idle", traduction: "Inactivo" },
    { original: "Error", traduction: "Error" },
    { original: "Permission", traduction: "Permiso" },
    { original: "No Cameras", traduction: "Sin cámaras" },
    { original: "Last Match:", traduction: "Última coincidencia:" },
    { original: "Code Scanner", traduction: "Escáner de código" },
    {
      original: "Request Camera Permissions",
      traduction: "Solicitar permisos de cámara",
    },
    {
      original: "Requesting camera permissions...",
      traduction: "Solicitando permisos de cámara...",
    },
    {
      original: "No camera found",
      traduction: "No se encontró ninguna cámara",
    },
    { original: "Stop Scanning", traduction: "Detener escaneo" },
    { original: "Start Scanning", traduction: "Iniciar escaneo" },
    { original: "Switch On Torch", traduction: "Encender linterna" },
    { original: "Switch Off Torch", traduction: "Apagar linterna" },
    {
      original: "Failed to turn on torch",
      traduction: "Error al encender la linterna",
    },
    {
      original: "Failed to turn off torch",
      traduction: "Error al apagar la linterna",
    },
    { original: "Launching Camera...", traduction: "Iniciando cámara..." },
    {
      original: "Scan an Image File",
      traduction: "Escanear un archivo de imagen",
    },
    {
      original: "Scan using camera directly",
      traduction: "Escanear usando la cámara directamente",
    },
    { original: "Select Camera", traduction: "Seleccionar cámara" },
    {
      original: "Choose Image - No image choosen",
      traduction: "Elegir imagen",
    },
    { original: "Choose Another", traduction: "Elegir otra" },
    { original: "Anonymous Camera", traduction: "Cámara anónima" },
    {
      original: "Or drop an image to scan",
      traduction: "O arrastra una imagen para escanear",
    },
    {
      original: "Or drop an image to scan (other files not supported)",
      traduction:
        "O arrastra una imagen para escanear (otros archivos no soportados)",
    },
    { original: "zoom", traduction: "zoom" },
    { original: "Loading image...", traduction: "Cargando imagen..." },
    { original: "Camera based scan", traduction: "Escaneo basado en cámara" },
    { original: "Fule based scan", traduction: "Escaneo basado en archivo" },

    { original: "Powered by ", traduction: "Desarrollado por " },
    { original: "Report issues", traduction: "Informar de problemas" },

    {
      original: "NotAllowedError: Permission denied",
      traduction: "Permiso denegado para acceder a la cámara",
    },
  ];

  function translateText(text: string) {
    const traduction = translates.find((t) => t.original === text);
    return traduction ? traduction.traduction : text;
  }

  function translateNodeText(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = translateText(node.textContent?.trim() ?? "");
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        translateNodeText(node.childNodes[i]);
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          translateNodeText(node);
        });
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);

  translateNodeText(document.body);
}

export function startTraduction() {
  document.addEventListener("DOMContentLoaded", function () {
    scannerTranslator();
  });
}

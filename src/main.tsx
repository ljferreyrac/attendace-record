import { createRoot } from "react-dom/client";
import "./index.css";
import CacheBuster from "react-cache-buster";
import { version } from "../package.json";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { startTraduction } from "./scannerTranslator.ts";
import { initializeApp } from "firebase/app";
import {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
} from "./config.ts";
import Loader from "./components/Loader.tsx";

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

startTraduction();

const isProduction = process.env.VITE_ENV === "production";

createRoot(document.getElementById("root")!).render(
  <CacheBuster
    currentVersion={version}
    isEnabled={isProduction}
    loadingComponent={<Loader />}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CacheBuster>
);

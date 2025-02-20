import type React from "react";
import { Route, Routes } from "react-router";
import QRScanner from "./components/QRScanner";
import AttendanceList from "./components/AttendanceList";
import Login from "./components/Login";
import AuthRoute from "./components/AuthRoute";
import Home from "./components/Home";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AuthRoute>
            <Home>
              <QRScanner />
            </Home>
          </AuthRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <AuthRoute>
            <Home>
              <AttendanceList />
            </Home>
          </AuthRoute>
        }
      />
    </Routes>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { QrCode, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

export interface IHomeProps {
  children: React.ReactNode;
}

const Home: React.FC<IHomeProps> = ({ children }: IHomeProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setIsAdmin(user.uid === "Gbkz9BmZCcUVFXhmYsbU9H9odu63");
    }
  }, [auth]);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const NavItems = () => (
    <>
      <Link
        to="/"
        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActivePath("/")
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <QrCode className="mr-2 h-5 w-5" />
        Escanear QR
      </Link>
      {isAdmin && (
        <Link
          to="/attendance"
          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isActivePath("/attendance")
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <ClipboardList className="mr-2 h-5 w-5" />
          Ver Asistencias
        </Link>
      )}
      <button
        onClick={() => {
          handleLogout();
          setIsMenuOpen(false);
        }}
        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
      >
        <LogOut className="mr-2 h-5 w-5" />
        Cerrar Sesión
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.jpeg"
                  alt="Logo Sistema de Asistencia"
                  className="h-8 w-auto sm:h-10"
                />
                <h1 className="text-xl font-bold text-gray-800">
                  Sistema de Asistencia
                </h1>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-8">
              <NavItems />
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavItems />
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Home;

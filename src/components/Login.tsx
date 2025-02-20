import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signInWithEmail = async () => {
    setAuthing(true);
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError("Usuario y/o contraseña incorrectos");
        setAuthing(false);
      });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="BranchOut Logo"
            className="h-20 w-auto mx-auto mb-6"
          />
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Inicio de sesión
          </h3>
          <p className="text-gray-600">Bienvenido al sistema de asistencia</p>
          <p className="font-bold text-gray-600">BranchOut</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          className="w-full mt-6 p-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          onClick={signInWithEmail}
          disabled={authing}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default Login;

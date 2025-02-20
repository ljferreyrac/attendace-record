import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router";
import Loader from "./Loader";

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = (props) => {
  const { children } = props;
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (
          location.pathname === "/attendance" &&
          user.uid !== "Gbkz9BmZCcUVFXhmYsbU9H9odu63"
        ) {
          navigate("/");
        }
        setLoading(false);
      } else {
        console.error("unauthorized");
        setLoading(false);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate, location]);

  if (loading) return <Loader />;

  return <div>{children}</div>;
};

export default AuthRoute;

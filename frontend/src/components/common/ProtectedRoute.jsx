import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <p>Loading...</p>; // or spinner
  }

  // 🔄 Wait until auth is loaded
  if (!user) {
    if (role === "ADMIN") {
      return <Navigate to="/admin/login" replace />;
    } else if (role === "STAFF") {
      return <Navigate to="/staff/login" replace />;
    }else {
      return <Navigate to="/" replace />;
    }
  }

  // 🔐 Role check
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

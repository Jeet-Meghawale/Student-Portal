import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Admin Dashboard</h2>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Page Content (later) */}
      <div>
        <p>Welcome Admin</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

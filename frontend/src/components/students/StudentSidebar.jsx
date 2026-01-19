import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
const sidebarStyle = {
  width: "240px",
  background: "#0f172a",
  color: "#fff",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};

const navStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#38bdf8" : "#e5e7eb",
  padding: "10px 12px",
  borderRadius: "6px",
  marginBottom: "8px",
  background: isActive ? "#1e293b" : "transparent",
  fontWeight: "500",
});

const logoutStyle = {
  marginTop: "auto",
  color: "#f87171",
  textDecoration: "none",
  padding: "10px 12px",
};

const StudentSidebar = () => {
    const { user, logout } = useContext(AuthContext);
  
  return (
    <div style={sidebarStyle}>
      <h3 style={{ marginBottom: "20px" }}>🎓 Student Portal</h3>

      <NavLink to="/student/dashboard" style={navStyle} end>
        Dashboard
      </NavLink>

      <NavLink to="/student/my-subjects" style={navStyle}>
        My Subjects
      </NavLink>

      <NavLink to="/student/assignments" style={navStyle}>
        Assignments
      </NavLink>

      <button
          onClick={logout}
          style={{
            marginTop: 8,
            width: "100%",
            padding: "8px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
    </div>
  );
};

export default StudentSidebar;

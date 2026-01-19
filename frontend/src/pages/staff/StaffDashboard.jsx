import UserHeader from "../../components/common/UserHeader";
import { Link } from "react-router-dom";

const StaffDashboard = () => {
  return (
    <div style={pageStyle}>
      {/* 🔐 Username + Logout */}
      <UserHeader redirectTo="/staff/login" />

      <h2 style={titleStyle}>Staff Dashboard</h2>
      <p style={subtitleStyle}>
        Manage your subjects and assignments
      </p>

      {/* Action Cards */}
      <div style={cardGrid}>
        <Link to="/staff/subjects" style={cardStyle}>
          <h3>📘 Assigned Subjects</h3>
          <p>View subjects assigned to you</p>
        </Link>

        <Link to="/staff/assignments/create" style={cardStyle}>
          <h3>📝 Create Assignment</h3>
          <p>Create assignments for your subjects</p>
        </Link>

        <div style={{ ...cardStyle, opacity: 0.6, cursor: "not-allowed" }}>
          <h3>📥 View Submissions</h3>
          <p>Coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

/* ---------------- STYLES ---------------- */

const pageStyle = {
  padding: "24px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const titleStyle = {
  marginTop: "10px",
  marginBottom: "4px",
};

const subtitleStyle = {
  color: "#64748b",
  marginBottom: "24px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#0f172a",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside
      style={{
        width: 260,
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "20px 14px"
      }}
    >
      {/* -------- BRAND -------- */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontWeight: 700 }}>🎓 EduPortal</h2>
        <p style={{ fontSize: 12, color: "#6b7280" }}>
          Admin Panel
        </p>
      </div>

      {/* -------- NAVIGATION -------- */}
      <NavItem to="/admin/dashboard" icon="🏠" label="Dashboard" />
      <NavItem to="/admin/users" icon="👥" label="User Management" />
      <NavItem to="/admin/subjects" icon="📘" label="Subject Management" />
      <NavItem to="/admin/meetings" icon="📅" label="Meetings" />

      {/* -------- FOOTER -------- */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 16,
          borderTop: "1px solid #e5e7eb"
        }}
      >
        <p style={{ fontWeight: 600 }}>{user?.name}</p>
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
    </aside>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        marginBottom: 6,
        borderRadius: 10,
        textDecoration: "none",
        fontWeight: 500,
        color: isActive ? "#2563eb" : "#374151",
        background: isActive ? "#eff6ff" : "transparent",
        transition: "all 0.2s ease",
        position: "relative"
      })}
    >
      {/* Active indicator */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 4,
          height: "60%",
          borderRadius: 4,
          background: "#2563eb",
          opacity: window.location.pathname === to ? 1 : 0
        }}
      />

      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;

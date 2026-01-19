import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f9fafb"
      }}
    >
      {/* -------- LEFT NAVBAR -------- */}
      <Sidebar />

      {/* -------- MAIN CONTENT -------- */}
      <div
        style={{
          flex: 1,
          padding: "32px",
          overflowY: "auto"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

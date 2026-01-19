import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/students/StudentSidebar.jsx";

const StudentLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <StudentSidebar />

      <div style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;

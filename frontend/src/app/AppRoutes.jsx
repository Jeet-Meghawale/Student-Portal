import { Routes, Route, Navigate, Link } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import SubjectList from "../pages/admin/subjects/SubjectList";

//Student Imports
import StudentLogin from "../pages/student/StudentLogin";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentSubjects from "../pages/student/StudentSubject.jsx";

import StaffDashboard from "../pages/staff/StaffDashboard.jsx"

// ---------------- USER MANAGEMENT ----------------
import UserManagementHome from "../pages/admin/users/UserManagementHome";
import AddStudents from "../pages/admin/users/AddStudents";
import AddStaff from "../pages/admin/users/AddStaff";
import AddAdmin from "../pages/admin/users/AddAdmin";
import EnrollStudents from "../pages/admin/subjects/EnrollStudents";

// ---------------- SUBJECT MANAGEMENT ----------------
// ✅ NEW IMPORTS
import SubjectManagementHome from "../pages/admin/subjects/SubjectManagementHome";
import CreateSubject from "../pages/admin/subjects/CreateSubject";
import StaffLogin from "../pages/staff/StaffLogin.jsx";

// ---------------- ADMIN DASHBOARD HOME ----------------
const AdminHome = () => {
  return (
    <div>
      <h2>Welcome to Admin Dashboard</h2>

      {/* ---------------- USER MANAGEMENT SECTION ---------------- */}
      <div>
        <h3>User Management</h3>
        <Link to="/admin/users">Go to User Management</Link>
      </div>

      {/* ---------------- SUBJECT MANAGEMENT SECTION ---------------- */}
      {/* ✅ NEW SECTION */}
      <div>
        <h3>Subject Management</h3>
        <Link to="/admin/subjects">Go to Subject Management</Link>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/*Student Routes*/}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route
        path="/student/subjects"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentSubjects />
          </ProtectedRoute>
        }
      />

      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff/dashboard" element={<StaffDashboard />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminHome />} />

        {/* ---------------- USER MANAGEMENT ROUTES ---------------- */}
        <Route path="users">
          <Route index element={<UserManagementHome />} />
          <Route path="students" element={<AddStudents />} />
          <Route path="staff" element={<AddStaff />} />
          <Route path="admins" element={<AddAdmin />} />
        </Route>

        {/* ---------------- SUBJECT MANAGEMENT ROUTES ---------------- */}
        {/* ✅ NEW ROUTES */}
        <Route path="subjects">
          <Route index element={<SubjectManagementHome />} />
          <Route path="create" element={<CreateSubject />} />
          <Route path="list" element={<SubjectList />} />
          <Route path=":subjectId/enroll" element={<EnrollStudents />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

import UserManagementHome from "../pages/admin/users/UserManagementHome";
import AddStudents from "../pages/admin/users/AddStudents";
import AddStaff from "../pages/admin/users/AddStaff";
import AddAdmin from "../pages/admin/users/AddAdmin";

import { Link } from "react-router-dom"; // ✅ ADDED for dashboard navigation

// ------------------------------
// Admin Dashboard Home
// ------------------------------
const AdminHome = () => {
  return (
    <div>
      <h2>Welcome to Admin Dashboard</h2>

      {/* ✅ NEW: User Management section */}
      <div>
        <h3>User Management</h3>

        {/* Clicking this redirects to /admin/users */}
        <Link to="/admin/users">Go to User Management</Link>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
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

        {/* ------------------------------
            User Management Routes
            ------------------------------ */}
        <Route path="users">
          <Route index element={<UserManagementHome />} />
          <Route path="students" element={<AddStudents />} />
          <Route path="staff" element={<AddStaff />} />
          <Route path="admins" element={<AddAdmin />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

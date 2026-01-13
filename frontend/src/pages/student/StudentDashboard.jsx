import UserHeader from "../../components/common/UserHeader";

const StudentDashboard = () => {
  return (
    <div>
      {/* 🔐 Header with username + logout */}
      <UserHeader redirectTo="/login" />

      <h2>Student Dashboard</h2>

      {/* existing content */}
    </div>
  );
};

export default StudentDashboard;

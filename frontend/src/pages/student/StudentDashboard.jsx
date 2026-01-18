import UserHeader from "../../components/common/UserHeader";
import { Link } from "react-router-dom";
const StudentDashboard = () => {
  return (
    <div>
      {/* 🔐 Header with username + logout */}
      <UserHeader redirectTo="/login" />

      <h2>Student Dashboard</h2>

      {/* existing content */}
      <Link to="/student/my-subjects">
        View My Subjects
      </Link>
      <br></br>
      <Link to="/student/assignments">Assignments</Link>


    </div>
  );
};

export default StudentDashboard;

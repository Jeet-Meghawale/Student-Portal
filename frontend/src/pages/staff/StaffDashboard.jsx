import UserHeader from "../../components/common/UserHeader";
import { Link } from "react-router-dom";

const StaffDashboard = () => {
  return (
    <div>
      {/* 🔐 Username (left) + Logout (right) */}
      <UserHeader redirectTo="/staff/login" />

      <h2>Staff Dashboard</h2>

      {/* Navigation cards / links */}
      <div>
        <h3>My Work</h3>

        <ul>
          <li>
            <Link to="/staff/subjects">
              View Assigned Subjects
            </Link>
          </li>

          <li>
            <Link to="/staff/assignments/create">
              Create Assignment
            </Link>
          </li>


          {/* Future */}
          <li>View Submissions (coming soon)</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffDashboard;

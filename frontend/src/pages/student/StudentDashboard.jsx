import { Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div>
      <h2>Student Dashboard</h2>

      <Link to="/student/my-subjects">My Subjects</Link>
      <br />
      <Link to="/student/assignments">Assignments</Link>
    </div>
  );
};

export default StudentDashboard;

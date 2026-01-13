import { Link } from "react-router-dom";

const SubjectManagementHome = () => {
  return (
    <div>
      <h2>Subject Management</h2>

      <ul>
        <li>
          <Link to="create">Create Subject</Link>
        </li>

        {/* ✅ NEW: Subject List */}
        <li>
          <Link to="list">View Subjects</Link>
        </li>
      </ul>
    </div>
  );
};

export default SubjectManagementHome;

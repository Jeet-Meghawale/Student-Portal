import { Link } from "react-router-dom";

const UserManagementHome = () => {
  return (
    <div>
      <h2>User Management</h2>

      <ul>
        <li>
          <Link to="students">Add Students (Bulk Upload)</Link>
        </li>
        <li>
          <Link to="staff">Add Staff</Link>
        </li>
        <li>
          <Link to="admins">Add Admin</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserManagementHome;

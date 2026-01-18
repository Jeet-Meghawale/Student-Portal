import { useEffect, useState } from "react";
import api from "../../services/api";
import UserHeader from "../../components/common/UserHeader";

const StaffSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch subjects assigned to staff
  // -----------------------------
  useEffect(() => {
    const fetchMySubjects = async () => {
      try {
        const res = await api.get("/api/subjects/teaching");

        const subjectData = Array.isArray(res.data.subjects)
          ? res.data.subjects
          : [];

        setSubjects(subjectData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to fetch assigned subjects"
        );
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMySubjects();
  }, []);

  if (loading) return <p>Loading subjects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Username + Logout */}
      {/* <UserHeader redirectTo="/staff/login" /> */}

      <h2>My Assigned Subjects</h2>

      {subjects.length === 0 ? (
        <p>No subjects assigned yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Create Assignment</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td>{subject.name}</td>
                <td>{subject.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffSubjects;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch all subjects (Admin)
  // -----------------------------
  useEffect(() => {
  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/subjects/");
      console.log(res.data.subjects);
      // ✅ ALWAYS ensure array
      const subjectData = Array.isArray(res.data.subjects)
        ? res.data.subjects
        : [];

      setSubjects(subjectData);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch subjects"
      );
      setSubjects([]); // ✅ fallback
    } finally {
      setLoading(false);
    }
  };

  fetchSubjects();
}, []);


  if (loading) return <p>Loading subjects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Subjects</h3>

      {subjects.length === 0 ? (
        <p>No subjects found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Assigned Staff</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td>{subject.name}</td>
                <td>{subject.code}</td>
                <td>
                  {subject.staff
                    ? `${subject.staff.name} (${subject.staff.email})`
                    : "Not Assigned"}
                </td>
                <td>
                  {/* ✅ Enroll Students Button */}
                  <Link to={`/admin/subjects/${subject._id}/enroll`}>
                    Enroll Students
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubjectList;

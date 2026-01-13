import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        /*
          BACKEND EXPECTATION:
          GET /api/student/subjects
          Returns subjects where student is enrolled
        */
        const res = await api.get("/api/student/subjects");
        setSubjects(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch subjects"
        );
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
      <h3>Enrolled Subjects</h3>

      {subjects.length === 0 ? (
        <p>No subjects enrolled</p>
      ) : (
        <ul>
          {subjects.map((subject) => (
            <li key={subject._id}>
              <strong>{subject.name}</strong> ({subject.code})  
              {subject.staff && (
                <span> — {subject.staff.name}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentSubjects;

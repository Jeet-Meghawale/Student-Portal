import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/api/assignments/student");

        const assignments = res.data.assignments || [];
        const subjectMap = new Map();

        assignments.forEach(a => {
          if (a.subject?._id) {
            subjectMap.set(a.subject._id, a.subject);
          }
        });

        setSubjects([...subjectMap.values()]);
      } catch {
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <p>Loading subjects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Subjects</h2>

      {subjects.map(subject => (
        <div
          key={subject._id}
          onClick={() =>
            navigate(`/student/assignments/subject/${subject._id}`)
          }
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
            cursor: "pointer"
          }}
        >
          <h4>{subject.name}</h4>
          <p>{subject.code}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentSubjects;

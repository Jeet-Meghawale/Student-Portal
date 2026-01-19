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
    <div style={styles.page}>
      <h2 style={styles.title}>My Subjects</h2>
      <p style={styles.subtitle}>
        Click on a subject to view assignments
      </p>

      <div style={styles.grid}>
        {subjects.map(subject => (
          <div
            key={subject._id}
            style={styles.card}
            onClick={() =>
              navigate(`/student/assignments/subject/${subject._id}`)
            }
          >
            <div style={styles.cardHeader}>
              <span style={styles.code}>{subject.code}</span>
              <h4 style={styles.subjectName}>{subject.name}</h4>
            </div>

            <div style={styles.cardFooter}>
              <span style={styles.action}>View Assignments →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSubjects;

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    padding: "24px"
  },
  title: {
    fontSize: "22px",
    fontWeight: "600"
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  },
  cardHeader: {
    marginBottom: "12px"
  },
  code: {
    display: "inline-block",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    marginBottom: "6px"
  },
  subjectName: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600"
  },
  cardFooter: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#4f46e5",
    fontWeight: "500"
  },
  action: {
    pointerEvents: "none"
  }
};

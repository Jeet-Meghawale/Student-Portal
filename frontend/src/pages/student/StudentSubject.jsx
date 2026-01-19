import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch enrolled subjects
  // -----------------------------
  useEffect(() => {
    const fetchMySubjects = async () => {
      try {
        const res = await api.get("/api/subjects/my");

        const subjectData = Array.isArray(res.data.subjects)
          ? res.data.subjects
          : [];

        setSubjects(subjectData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to fetch subjects"
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
    <div style={container}>
      {/* Page Header */}
      <div style={header}>
        <h1>📘 My Subjects</h1>
        <p style={subtitle}>
          View all your enrolled subjects and access assignments
        </p>
      </div>

      {/* Subject Cards */}
      {subjects.length === 0 ? (
        <p>You are not enrolled in any subjects</p>
      ) : (
        <div style={grid}>
          {subjects.map((subject, index) => (
            <div key={subject._id} style={card}>
              <div
                style={{
                  ...cardHeader,
                  background: gradients[index % gradients.length],
                }}
              >
                <span style={badge}>{subject.code}</span>
                <h3>{subject.name}</h3>
              </div>

              <div style={cardBody}>
                <p style={infoText}>
                  🎓 Assigned Staff
                </p>
                <p style={staffName}>
                  {subject.staff?.name || "Not Assigned"}
                </p>

                <Link
                  to={`/student/assignments/subject/${subject._id}`}
                  style={cta}
                >
                  View Assignments →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const container = {
  padding: "20px",
};

const header = {
  marginBottom: "24px",
};

const subtitle = {
  color: "#64748b",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "24px",
};

const card = {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease",
};

const cardHeader = {
  padding: "20px",
  color: "#fff",
};

const badge = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.25)",
  fontSize: "12px",
  marginBottom: "8px",
};

const cardBody = {
  padding: "20px",
};

const infoText = {
  fontSize: "12px",
  color: "#64748b",
};

const staffName = {
  fontWeight: "600",
  marginBottom: "16px",
};

const cta = {
  display: "inline-block",
  marginTop: "8px",
  padding: "10px 14px",
  background: "#f1f5f9",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "500",
  color: "#0f172a",
};

const gradients = [
  "linear-gradient(135deg, #3b82f6, #06b6d4)",
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(135deg, #22c55e, #10b981)",
  "linear-gradient(135deg, #f97316, #ef4444)",
  "linear-gradient(135deg, #6366f1, #3b82f6)",
];

export default StudentSubjects;

import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

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
    <div style={pageStyle}>
      <h2 style={titleStyle}>My Assigned Subjects</h2>
      <p style={subtitleStyle}>
        Select a subject to manage assignments
      </p>

      {subjects.length === 0 ? (
        <p>No subjects assigned yet</p>
      ) : (
        <div style={cardGrid}>
          {subjects.map((subject) => (
            <div key={subject._id} style={cardStyle}>
              <h3>{subject.name}</h3>
              <p style={codeStyle}>{subject.code}</p>

              <Link
                to={`/staff/assignments/select-subject`}
                state={{ subject }}
                style={buttonStyle}
              >
                Manage Assignments →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffSubjects;

/* ---------------- STYLES ---------------- */

const pageStyle = {
  padding: "24px",
};

const titleStyle = {
  marginBottom: "4px",
};

const subtitleStyle = {
  color: "#64748b",
  marginBottom: "24px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const codeStyle = {
  color: "#64748b",
  marginBottom: "16px",
};

const buttonStyle = {
  marginTop: "auto",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "6px",
  background: "#2563eb",
  color: "#fff",
  textAlign: "center",
  fontWeight: "500",
};

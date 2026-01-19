import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const SelectSubjectForAssignment = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/api/subjects/teaching");

        const data = Array.isArray(res.data.subjects)
          ? res.data.subjects
          : [];

        setSubjects(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load subjects"
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
    <div style={pageStyle}>
      <h2 style={titleStyle}>Select Subject</h2>
      <p style={subtitleStyle}>
        Choose a subject to manage assignments
      </p>

      {subjects.length === 0 ? (
        <p>No subjects assigned</p>
      ) : (
        <div style={cardGrid}>
          {subjects.map((subject) => (
            <div key={subject._id} style={cardStyle}>
              <div>
                <h3>{subject.name}</h3>
                <p style={codeStyle}>{subject.code}</p>
              </div>

              <div style={buttonGroup}>
                <button
                  style={secondaryButton}
                  onClick={() =>
                    navigate(
                      `/staff/subjects/${subject._id}/assignments`
                    )
                  }
                >
                  View Assignments
                </button>

                <button
                  style={primaryButton}
                  onClick={() =>
                    navigate(
                      `/staff/subjects/${subject._id}/assignments/create`
                    )
                  }
                >
                  Create Assignment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectSubjectForAssignment;

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
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

const buttonGroup = {
  display: "flex",
  gap: "10px",
};

const primaryButton = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "500",
  cursor: "pointer",
};

const secondaryButton = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #2563eb",
  background: "#ffffff",
  color: "#2563eb",
  fontWeight: "500",
  cursor: "pointer",
};

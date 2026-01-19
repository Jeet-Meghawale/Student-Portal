import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/api";

const SubjectAssignments = () => {
  const { subjectId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get(
          `/api/assignments/subject/${subjectId}`
        );

        const data = Array.isArray(res.data.assignments)
          ? res.data.assignments
          : [];

        setAssignments(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load assignments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [subjectId]);

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Assignments</h2>
      <p style={subtitleStyle}>
        Assignments created for this subject
      </p>

      {assignments.length === 0 ? (
        <p>No assignments created yet</p>
      ) : (
        <div style={cardGrid}>
          {assignments.map((assignment) => (
            <div key={assignment._id} style={cardStyle}>
              <div>
                <h3>{assignment.title}</h3>
                <p style={dateStyle}>
                  📅 Due:{" "}
                  {new Date(
                    assignment.dueDate
                  ).toLocaleDateString()}
                </p>
                <p style={groupStyle}>
                  👥 Group Allowed:{" "}
                  {assignment.allowGroup ? "Yes" : "No"}
                </p>
              </div>

              <Link
                to={`/staff/assignments/${assignment._id}`}
                style={buttonStyle}
              >
                View Assignment →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectAssignments;

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

const dateStyle = {
  marginTop: "8px",
  color: "#334155",
};

const groupStyle = {
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

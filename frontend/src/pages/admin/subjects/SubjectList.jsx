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
        const res = await api.get("/api/subjects");

        // ✅ Backend returns { total, subjects }
        const subjectData = Array.isArray(res.data.subjects)
          ? res.data.subjects
          : [];

        setSubjects(subjectData);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch subjects"
        );
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) return <p>Loading subjects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={pageWrapper}>
      <h2 style={title}>Subjects</h2>
      <p style={subtitle}>
        Manage subjects, assigned staff, and student enrollment
      </p>

      {subjects.length === 0 ? (
        <p>No subjects found</p>
      ) : (
        <div style={grid}>
          {subjects.map((subject) => (
            <div key={subject._id} style={card}>
              {/* Header */}
              <div style={cardHeader}>
                <h3 style={subjectName}>{subject.name}</h3>
                <span style={codeBadge}>{subject.code}</span>
              </div>

              {/* Staff */}
              <div style={staffSection}>
                <p style={staffLabel}>Assigned Staff</p>
                {subject.staff ? (
                  <>
                    <p style={staffName}>{subject.staff.name}</p>
                    <p style={staffEmail}>{subject.staff.email}</p>
                  </>
                ) : (
                  <p style={notAssigned}>Not Assigned</p>
                )}
              </div>

              {/* Actions */}
              <div style={actions}>
                <Link
                  to={`/admin/subjects/${subject._id}/enroll`}
                  style={enrollBtn}
                >
                  Enroll Students
                </Link>

                {/* Placeholder for future */}
                <button style={secondaryBtn} disabled>
                  View Enrolled
                </button>

                <button style={deleteBtn} disabled>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const pageWrapper = {
  padding: "40px",
};

const title = {
  fontSize: "28px",
  fontWeight: "700",
};

const subtitle = {
  marginBottom: "32px",
  color: "#6b7280",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px",
};

const card = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const subjectName = {
  fontSize: "20px",
  fontWeight: "700",
};

const codeBadge = {
  background: "#eef2ff",
  color: "#4338ca",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "600",
};

const staffSection = {
  marginBottom: "20px",
};

const staffLabel = {
  fontSize: "13px",
  color: "#6b7280",
};

const staffName = {
  fontWeight: "600",
};

const staffEmail = {
  fontSize: "14px",
  color: "#4b5563",
};

const notAssigned = {
  color: "#9ca3af",
  fontStyle: "italic",
};

const actions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const enrollBtn = {
  background: "#16a34a",
  color: "#ffffff",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
};

const secondaryBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "not-allowed",
};

const deleteBtn = {
  background: "#fee2e2",
  color: "#991b1b",
  border: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "not-allowed",
};

export default SubjectList;

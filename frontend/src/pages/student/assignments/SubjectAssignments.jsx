import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const SubjectAssignments = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/api/assignments/student");

        const filteredAssignments = (res.data.assignments || []).filter(
          a => a.subject?._id === subjectId
        );

        setAssignments(filteredAssignments);
      } catch {
        setError("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [subjectId]);

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments for this subject</p>
      ) : (
        <div style={styles.grid}>
          {assignments.map((assignment) => {
            const isLate =
              new Date(assignment.dueDate) < new Date();

            return (
              <div
                key={assignment._id}
                style={styles.card}
                onClick={() =>
                  navigate(
                    `/student/assignments/${assignment._id}/submit`
                  )
                }
              >
                <h4 style={styles.assignmentTitle}>
                  {assignment.title}
                </h4>

                {assignment.description && (
                  <p style={styles.description}>
                    {assignment.description}
                  </p>
                )}

                <div style={styles.meta}>
                  <span>
                    Due:{" "}
                    {new Date(
                      assignment.dueDate
                    ).toLocaleDateString()}
                  </span>

                  <span
                    style={{
                      ...styles.badge,
                      background: isLate
                        ? "#fee2e2"
                        : "#dcfce7",
                      color: isLate
                        ? "#dc2626"
                        : "#16a34a"
                    }}
                  >
                    {isLate ? "Late" : "Open"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectAssignments;

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    padding: "24px"
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "16px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease"
  },
  assignmentTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px"
  },
  description: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "10px"
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px"
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: "500"
  }
};

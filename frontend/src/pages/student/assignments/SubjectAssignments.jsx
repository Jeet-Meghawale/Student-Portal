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
      } catch (err) {
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
    <div>
      <h2>Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments for this subject</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              onClick={() =>
                navigate(
                  `/student/assignments/${assignment._id}/submit`
                )
              }
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              <h4>{assignment.title}</h4>

              {assignment.description && (
                <p>{assignment.description}</p>
              )}

              <p>
                <strong>Due:</strong>{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectAssignments;

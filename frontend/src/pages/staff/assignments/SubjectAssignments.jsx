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
    <div>
      <h2>Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments created yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Due Date</th>
              <th>Group Allowed</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id}>
                <td>{assignment.title}</td>
                <td>
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </td>
                <td>{assignment.allowGroup ? "Yes" : "No"}</td>
                <td>
                  {/* optional future */}
                  <Link
                    to={`/staff/assignments/${assignment._id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubjectAssignments;

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const CreateAssignment = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [allowGroup, setAllowGroup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // Submit Assignment
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !dueDate) {
      setError("Title and due date are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/assignments", {
        title,
        description,
        subjectId,
        dueDate,
        allowGroup
      });

      setSuccess("Assignment created successfully");

      // Optional: redirect back to subjects
      setTimeout(() => {
        navigate("/staff/subjects");
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create assignment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Assignment</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={allowGroup}
              onChange={(e) => setAllowGroup(e.target.checked)}
            />
            Allow Group Submission
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;

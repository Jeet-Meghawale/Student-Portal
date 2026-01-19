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
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Create Assignment</h2>
        <p style={subtitleStyle}>
          Fill in the details to create a new assignment
        </p>

        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="Assignment title"
            />
          </div>

          <div style={fieldStyle}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={textareaStyle}
              placeholder="Assignment description (optional)"
            />
          </div>

          <div style={fieldStyle}>
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={checkboxRow}>
            <input
              type="checkbox"
              checked={allowGroup}
              onChange={(e) => setAllowGroup(e.target.checked)}
            />
            <span>Allow Group Submission</span>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "40px",
  background: "#f8fafc",
};

const cardStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const titleStyle = {
  marginBottom: "4px",
};

const subtitleStyle = {
  color: "#64748b",
  marginBottom: "20px",
};

const errorStyle = {
  background: "#fee2e2",
  color: "#dc2626",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "12px",
};

const successStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "12px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
};

const textareaStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  minHeight: "80px",
};

const checkboxRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: "600",
  cursor: "pointer",
};

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // Handle File Selection
  // -----------------------------
  const handleFileChange = (e) => {
    setError("");
    setFile(e.target.files[0]);
  };

  // -----------------------------
  // Submit Assignment
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("file", file); // MUST be "file"

      // ⚠️ DO NOT set Content-Type manually
      await api.post("/api/submissions", formData);

      setSuccess("Assignment submitted successfully");

      setTimeout(() => {
        navigate(-1);
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to submit assignment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Submit Assignment</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Assignment"}
        </button>
      </form>
    </div>
  );
};

export default SubmitAssignment;

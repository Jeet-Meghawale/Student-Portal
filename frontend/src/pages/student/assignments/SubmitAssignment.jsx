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
      formData.append("file", file);

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Submit Assignment</h2>
        <p style={styles.subtitle}>
          Upload your completed assignment before the due date
        </p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Upload File</label>

          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
            style={styles.fileInput}
          />

          {file && (
            <p style={styles.fileName}>
              Selected file: <strong>{file.name}</strong>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignment;

/* -----------------------------
   Inline Styles (UI ONLY)
----------------------------- */
const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    padding: "24px"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
  },
  title: {
    marginBottom: "6px",
    fontSize: "22px",
    fontWeight: "600"
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#64748b"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500"
  },
  fileInput: {
    padding: "10px",
    border: "1px dashed #cbd5e1",
    borderRadius: "8px",
    background: "#f9fafb"
  },
  fileName: {
    fontSize: "13px",
    color: "#334155"
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px"
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    marginBottom: "10px"
  },
  success: {
    color: "#16a34a",
    fontSize: "14px",
    marginBottom: "10px"
  }
};

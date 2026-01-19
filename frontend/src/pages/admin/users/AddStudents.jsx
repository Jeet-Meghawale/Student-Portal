import { useState } from "react";
import * as XLSX from "xlsx";
import api from "../../../services/api";

const AddStudents = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Handle Excel File Upload
  // -----------------------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setError("");
    setSuccess("");

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData.length) {
          setError("Excel file is empty");
          return;
        }

        const formattedStudents = jsonData.map((row, index) => {
          if (!row.name || !row.email) {
            throw new Error(`Missing name or email in row ${index + 2}`);
          }

          return {
            name: row.name,
            email: row.email,
            password: row.email,
            role: "STUDENT",
          };
        });

        if (formattedStudents.length > 500) {
          throw new Error("Maximum 500 students allowed per upload");
        }

        setStudents(formattedStudents);
      } catch (err) {
        setError(err.message || "Invalid Excel format");
        setStudents([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // -----------------------------
  // Submit Students
  // -----------------------------
  const handleSubmit = async () => {
    if (!students.length) {
      setError("No students to upload");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post("/api/auth/register", {
        users: students,
      });

      setSuccess(`${students.length} students added successfully`);
      setStudents([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "640px" }}>
        {/* Title */}
        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>
          Add Students
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "28px" }}>
          Upload an Excel or CSV file to add students in bulk
        </p>

        {/* Messages */}
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        {/* Upload Card */}
        <div style={cardStyle}>
          <label style={uploadLabel}>
            Upload Excel / CSV File
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>

          {students.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontWeight: "600" }}>
                Total Students: {students.length}
              </p>

              <ul style={previewList}>
                {students.slice(0, 5).map((student, index) => (
                  <li key={index}>
                    {student.name} — {student.email}
                  </li>
                ))}
              </ul>

              {students.length > 5 && (
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  Showing first 5 students
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  ...buttonStyle,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Uploading..." : "Upload Students"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const cardStyle = {
  background: "#ffffff",
  padding: "32px",
  borderRadius: "14px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  borderLeft: "6px solid #16a34a", // 🟢 Student theme
};

const uploadLabel = {
  display: "block",
  padding: "18px",
  border: "2px dashed #16a34a",
  borderRadius: "10px",
  textAlign: "center",
  cursor: "pointer",
  fontWeight: "600",
  color: "#166534",
};

const previewList = {
  marginTop: "12px",
  paddingLeft: "18px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "18px",
  borderRadius: "10px",
  border: "none",
  background: "#16a34a",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const errorStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "16px",
};

const successStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "16px",
};

export default AddStudents;

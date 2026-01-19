import { useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import api from "../../../services/api";

const EnrollStudents = () => {
  const { subjectId } = useParams();

  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Handle Excel Upload
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

        const extractedEmails = jsonData.map((row, index) => {
          if (!row.email) {
            throw new Error(`Missing email in row ${index + 2}`);
          }
          return row.email;
        });

        const uniqueEmails = [...new Set(extractedEmails)];

        if (uniqueEmails.length < extractedEmails.length) {
          setError("Duplicate emails found in Excel file");
          return;
        }

        setEmails(uniqueEmails);
      } catch (err) {
        setError(err.message || "Invalid Excel format");
        setEmails([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // -----------------------------
  // Submit Enrollment
  // -----------------------------
  const handleEnroll = async () => {
    if (!emails.length) {
      setError("No students to enroll");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post("/api/subjects/enroll-bulk", {
        subjectId,
        studentEmails: emails
      });

      setSuccess(
        `Enrollment completed. Enrolled: ${res.data.enrolledCount}, Skipped: ${res.data.skippedCount}`
      );

      if (res.data.invalidEmails?.length) {
        setError(
          `These emails are not registered students:\n${res.data.invalidEmails.join(", ")}`
        );
      }

      setEmails([]);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to enroll students"
      );
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
      <div style={{ width: "100%", maxWidth: "620px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>
          Enroll Students
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "28px" }}>
          Upload an Excel or CSV file to enroll students into this subject
        </p>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <div style={cardStyle}>
          {/* Upload */}
          <label style={uploadBox}>
            Click to upload Excel / CSV file
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>

          {/* Preview */}
          {emails.length > 0 && (
            <div style={{ marginTop: "22px" }}>
              <p style={{ fontWeight: "600" }}>
                Total Students: {emails.length}
              </p>

              <ul style={previewList}>
                {emails.slice(0, 5).map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>

              {emails.length > 5 && (
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  Showing first 5 students
                </p>
              )}

              <button
                onClick={handleEnroll}
                disabled={loading}
                style={{
                  ...submitBtn,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Enrolling..." : "Enroll Students"}
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
  borderLeft: "6px solid #16a34a",
};

const uploadBox = {
  display: "block",
  padding: "20px",
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

const submitBtn = {
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
  whiteSpace: "pre-line",
};

const successStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "16px",
};

export default EnrollStudents;

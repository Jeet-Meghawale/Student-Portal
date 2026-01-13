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

        // Extract emails & validate
        const extractedEmails = jsonData.map((row, index) => {
          if (!row.email) {
            throw new Error(`Missing email in row ${index + 2}`);
          }
          return row.email;
        });

        // Remove duplicate emails inside file
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

    /*
      ✅ BACKEND EXPECTATION
      POST /api/subjects/enroll-bulk
      Payload: { subjectId, studentEmails }
    */
    const res = await api.post("/api/subjects/enroll-bulk", {
      subjectId,
      studentEmails: emails
    });

    console.log(res.data);    
    setSuccess(
      `Enrollment completed. Enrolled: ${res.data.enrolledCount}, Skipped: ${res.data.skippedCount}`
    );

    setEmails([]);
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to enroll students"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h3>Enroll Students</h3>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {/* Excel Upload */}
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
      />

      {/* Preview */}
      {emails.length > 0 && (
        <div>
          <p>Total Students: {emails.length}</p>

          <ul>
            {emails.slice(0, 5).map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>

          {emails.length > 5 && (
            <p>Showing first 5 students</p>
          )}

          <button onClick={handleEnroll} disabled={loading}>
            {loading ? "Enrolling..." : "Enroll Students"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrollStudents;

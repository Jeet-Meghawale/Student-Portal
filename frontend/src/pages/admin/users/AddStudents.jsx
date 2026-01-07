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

        // Take only the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData.length) {
          setError("Excel file is empty");
          return;
        }

        // Map & validate rows
        const formattedStudents = jsonData.map((row, index) => {
          if (!row.name || !row.email) {
            throw new Error(
              `Missing name or email in row ${index + 2}`
            );
          }

          return {
            name: row.name,
            email: row.email,
            password: row.email, // ✅ default password = email
            role: "STUDENT",     // ✅ force role
          };
        });

        // Optional safety limit (recommended)
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
  // Submit Students to Backend
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

      /*
        ✅ SINGLE BACKEND ROUTE
        POST /api/auth/register
      */
      await api.post("/api/auth/register", {
        users: students,
      });

      setSuccess(`${students.length} students added successfully`);
      setStudents([]);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to upload students"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Add Students (Bulk Upload)</h3>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {/* Excel Upload */}
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
      />

      {/* Preview */}
      {students.length > 0 && (
        <div>
          <p>Total Students: {students.length}</p>

          <ul>
            {students.slice(0, 5).map((student, index) => (
              <li key={index}>
                {student.name} — {student.email}
              </li>
            ))}
          </ul>

          {students.length > 5 && (
            <p>Showing first 5 students</p>
          )}

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Upload Students"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddStudents;

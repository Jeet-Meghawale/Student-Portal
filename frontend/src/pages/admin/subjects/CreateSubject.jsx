import { useState } from "react";
import api from "../../../services/api";

const CreateSubject = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [staffEmail, setStaffEmail] = useState("");
  const [staff, setStaff] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStaffSearch = async () => {
    setError("");
    setStaff(null);

    if (!staffEmail) {
      setError("Please enter staff email");
      return;
    }

    try {
      const res = await api.post(
        "/api/users/get-staff-id-by-email",
        { email: staffEmail }
      );

      setStaff(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Staff not found");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !code || !staff) {
      setError("All fields are required and staff must be verified");
      return;
    }

    try {
      setLoading(true);

      const sub = await api.post("/api/subjects/create-subject", {
        name,
        code,
        staffId: staff.userId,
      });

      setSuccess("Subject created successfully");
      console.log(sub);

      setName("");
      setCode("");
      setStaffEmail("");
      setStaff(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create subject");
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
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>
          Create Subject
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "28px" }}>
          Create a subject and assign it to a staff member
        </p>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <form onSubmit={handleSubmit} style={cardStyle}>
          {/* Subject Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Subject Code */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Subject Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Staff Search */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Staff Email</label>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="email"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                style={inputStyle}
              />

              <button
                type="button"
                onClick={handleStaffSearch}
                style={verifyBtn}
              >
                Verify
              </button>
            </div>
          </div>

          {/* Verified Staff */}
          {staff && (
            <div style={verifiedBox}>
              Assigned Staff:{" "}
              <strong>{staff.name}</strong> ({staff.email})
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating..." : "Create Subject"}
          </button>
        </form>
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
  borderLeft: "6px solid #7c3aed", // 🟣 Subject theme
};

const fieldStyle = {
  marginBottom: "18px",
};

const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "15px",
};

const verifyBtn = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#4f46e5",
  color: "#ffffff",
  fontWeight: "600",
  cursor: "pointer",
};

const submitBtn = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "10px",
  border: "none",
  background: "#7c3aed",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const verifiedBox = {
  background: "#ecfeff",
  color: "#155e75",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "18px",
  fontSize: "14px",
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

export default CreateSubject;

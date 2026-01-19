import { useState } from "react";
import api from "../../../services/api";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        ...formData,
        role: "STAFF",
      });

      setSuccess("Staff added successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add staff");
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
      <div style={{ width: "100%", maxWidth: "520px" }}>
        {/* Title */}
        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>
          Add Staff
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "28px" }}>
          Create a staff account with teaching access
        </p>

        {/* Messages */}
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        {/* Card */}
        <form onSubmit={handleSubmit} style={cardStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Adding..." : "Add Staff"}
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
  borderLeft: "6px solid #2563eb", // 🔵 Staff theme
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

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
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

export default AddStaff;

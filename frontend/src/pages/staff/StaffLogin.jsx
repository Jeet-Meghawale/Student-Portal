import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const StaffLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (user.role !== "STAFF") {
        setError("Invalid Credentials");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/staff/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Staff Login</h2>
        <p style={subtitleStyle}>Welcome back, please login</p>

        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="staff@example.com"
            />
          </div>

          <div style={fieldStyle}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={footerText}>
          Student? <Link to="/login" style={linkStyle}>Student Login</Link>
        </p>
      </div>
    </div>
  );
};

export default StaffLogin;

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
};

const cardStyle = {
  width: "380px",
  background: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const titleStyle = {
  marginBottom: "5px",
  textAlign: "center",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#64748b",
  marginBottom: "20px",
};

const errorStyle = {
  color: "#dc2626",
  background: "#fee2e2",
  padding: "8px",
  borderRadius: "6px",
  marginBottom: "12px",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #cbd5f5",
  fontSize: "14px",
};

const buttonStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
};

const footerText = {
  marginTop: "15px",
  textAlign: "center",
  fontSize: "14px",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "500",
};

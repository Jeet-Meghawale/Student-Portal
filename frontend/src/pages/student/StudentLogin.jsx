import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "./StudentLogin.css";
import { Link } from "react-router-dom";


const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔵 UI ONLY (show/hide password)
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;

      if (user.role !== "STUDENT") {
        setError("Access denied. Student login only.");
        return;
      }

      login(token, user);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-left">
          <h1 className="logo">Logo Here</h1>
          <p className="welcome">Welcome back !!!</p>

          <h2 className="title">Student Login</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="login@gmail.com"
            />

            <label>Password</label>

            {/* 🔵 PASSWORD FIELD WITH TOGGLE */}
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="************"
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>

              <p>
                Staff member? <Link to="/staff/login">Staff Login</Link>
              </p>

            </div>

            <button type="submit" className="login-btn">
              LOGIN →
            </button>
          </form>
        </div>

        <div className="login-right">
          <img
            src="/images/student-login.avif"
            alt="Student working on desk"
          />
        </div>

      </div>
    </div>
  );
};

export default StudentLogin;

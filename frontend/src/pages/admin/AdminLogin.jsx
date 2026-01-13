import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/authServices";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ use context

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

      const data = await loginService(email, password);

      // 🔐 STRICT ROLE CHECK
      if (data.user.role !== "ADMIN") {
        setError("You are not authorized to access admin panel");
        return;
      }

      // ✅ SINGLE SOURCE OF TRUTH
      login({
        token: data.token,
        user: data.user,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Login</h2>

      {error && <p>{error}</p>}

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default AdminLogin;

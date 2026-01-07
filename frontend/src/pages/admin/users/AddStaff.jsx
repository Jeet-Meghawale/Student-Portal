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

    // basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      /*
        ✅ SINGLE BACKEND ROUTE
        POST /api/auth

        role is explicitly sent as STAFF
        backend must:
        - verify ADMIN token
        - hash password
        - save user
      */
      await api.post("/api/auth/register", {
        ...formData,
        role: "STAFF",
      });

      setSuccess("Staff added successfully");

      // reset form after success
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add staff"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Add Staff</h3>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Staff"}
        </button>
      </form>
    </div>
  );
};

export default AddStaff;

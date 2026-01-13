import { useState } from "react";
import api from "../../../services/api";

const CreateSubject = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // Staff search state
  const [staffEmail, setStaffEmail] = useState("");
  const [staff, setStaff] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------
  // Search staff by email
  // ----------------------------------
  const handleStaffSearch = async () => {
    setError("");
    setStaff(null);

    if (!staffEmail) {
      setError("Please enter staff email");
      return;
    }

    try {
      /*
        ✅ BACKEND EXPECTATION
        GET /api/admin/staff/search?email=...
        - Must return STAFF user
      */
      const res = await api.post(
        "/api/users/get-staff-id-by-email",
        { email: staffEmail }
      );

      setStaff(res.data); // expects { _id, name, email }
    } catch (err) {
      setError(
        err.response?.data?.message || "Staff not found"
      );
    }
  };

  // ----------------------------------
  // Create subject
  // ----------------------------------
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

      /*
        ✅ CREATE SUBJECT
        POST /api/subjects
        staffId is used for DB relation
      */
     console.log("Staff state:", staff);

     const sub =  await api.post("/api/subjects/create-subject", {
        name,
        code,
        staffId: staff.userId,
      });

      setSuccess("Subject created successfully");
      console.log(sub);
      // Reset form
      setName("");
      setCode("");
      setStaffEmail("");
      setStaff(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create subject"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create Subject</h3>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Subject Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* -------- Staff Search -------- */}
        <div>
          <label>Staff Email</label>
          <input
            type="email"
            value={staffEmail}
            onChange={(e) => setStaffEmail(e.target.value)}
          />
          <button type="button" onClick={handleStaffSearch}>
            Verify Staff
          </button>
        </div>

        {/* Show verified staff */}
        {staff && (
          <p>
            Assigned Staff: {staff.name} ({staff.email})
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Subject"}
        </button>
      </form>
    </div>
  );
};

export default CreateSubject;

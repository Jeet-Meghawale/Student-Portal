import { Link } from "react-router-dom";

const SubjectManagementHome = () => {
  return (
    <div style={pageWrapper}>
      <div style={container}>
        <h2 style={title}>Subject Management</h2>
        <p style={subtitle}>
          Manage subjects, assign staff, and enroll students
        </p>

        <div style={cardGrid}>
          {/* Create Subject */}
          <Link to="/admin/subjects/create" style={cardLink}>
            <div style={{ ...card, borderLeft: "6px solid #7c3aed" }}>
              <h3>Create Subject</h3>
              <p>
                Add a new subject and assign it to a staff member
              </p>
            </div>
          </Link>

          {/* View Subjects */}
          <Link to="/admin/subjects/list" style={cardLink}>
            <div style={{ ...card, borderLeft: "6px solid #2563eb" }}>
              <h3>View Subjects</h3>
              <p>
                View all subjects with assigned staff and actions
              </p>
            </div>
          </Link>

          {/* Enroll Students */}
          <Link to="/admin/subjects/list" style={cardLink}>
            <div style={{ ...card, borderLeft: "6px solid #16a34a" }}>
              <h3>Enroll Students</h3>
              <p>
                Enroll students into subjects using bulk upload
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const pageWrapper = {
  padding: "40px",
};

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const title = {
  fontSize: "28px",
  fontWeight: "700",
};

const subtitle = {
  marginTop: "6px",
  marginBottom: "32px",
  color: "#6b7280",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px",
};

const card = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "14px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const cardLink = {
  textDecoration: "none",
  color: "inherit",
};

export default SubjectManagementHome;

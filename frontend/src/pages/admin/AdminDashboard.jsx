import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "User Management",
      description: "Manage students, staff & admins",
      color: "#e0f2fe",
      action: () => navigate("/admin/users")
    },
    {
      title: "Subject Management",
      description: "Create subjects & enroll students",
      color: "#ede9fe",
      action: () => navigate("/admin/subjects")
    },
    {
      title: "Meetings",
      description: "Schedule & view meeting logs",
      color: "#fff7ed",
      action: () => navigate("/admin/meetings")
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px"
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.action}
            style={{
              background: card.color,
              padding: "20px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

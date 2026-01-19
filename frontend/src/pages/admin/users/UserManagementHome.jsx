import { useNavigate } from "react-router-dom";

const UserManagementHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Add Staff",
      description: "Create staff accounts",
      color: "#e0f7fa",
      action: () => navigate("/admin/users/staff")
    },
    {
      title: "Add Students",
      description: "Bulk upload students via Excel",
      color: "#ecfdf5",
      action: () => navigate("/admin/users/students")
    },
    {
      title: "Add Admin",
      description: "Grant admin access",
      color: "#fce7f3",
      action: () => navigate("/admin/users/admins")
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>User Management</h2>

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

export default UserManagementHome;

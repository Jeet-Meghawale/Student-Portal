import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserHeader = ({ redirectTo }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(redirectTo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      {/* 👤 Username on left */}
      <div>
        <strong>{user?.name}</strong>
      </div>

      {/* 🚪 Logout on right */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserHeader;

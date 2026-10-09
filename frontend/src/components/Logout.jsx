import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          await API.post("/auth/logout", { refreshToken });
        }
      } catch (error) {
        console.error("Logout error on server:", error?.response?.data?.message || error.message);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Logging out...</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "32px",
    borderRadius: "12px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "4px solid #334155",
    borderTop: "4px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  text: {
    color: "#f8fafc",
    fontSize: "1rem",
    fontWeight: "500",
    margin: 0
  }
};

export default Logout;
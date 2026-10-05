import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";

function NavigationHeader() {
  // Check if user is logged in by verifying token presence in localStorage
  const isAuthenticated = !!(localStorage.getItem("token") || localStorage.getItem("accessToken"));

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        <Link to="/" style={styles.brandLogo}>
          <span style={styles.logoIcon}>⚡</span>
          SubTrack
        </Link>
        <nav style={styles.navActions}>
          {isAuthenticated ? (
            <Link to="/logout" style={{ ...styles.navBtn, ...styles.logoutNavBtn }}>
              Sign Out
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ ...styles.navBtn, ...styles.outlineBtn }}>
                Login
              </Link>
              <Link to="/register" style={{ ...styles.navBtn, ...styles.primaryNavBtn }}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <div style={styles.appWrapper}>
        <NavigationHeader />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
appWrapper: {
minHeight: "100vh",
backgroundColor: "#0f172a",
fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
color: "#f8fafc",
},
header: {
backgroundColor: "#1e293b",
borderBottom: "1px solid #334155",
position: "sticky",
top: 0,
zIndex: 100,
},
headerContainer: {
maxWidth: "1200px",
margin: "0 auto",
padding: "16px 24px",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
},
brandLogo: {
fontSize: "1.4rem",
fontWeight: "800",
color: "#38bdf8",
textDecoration: "none",
display: "flex",
alignItems: "center",
gap: "8px",
},
logoIcon: {
fontSize: "1.2rem",
},
navActions: {
display: "flex",
alignItems: "center",
gap: "12px",
},
navBtn: {
padding: "8px 20px",
borderRadius: "8px",
fontWeight: "600",
fontSize: "0.9rem",
textDecoration: "none",
transition: "all 0.2s ease",
},
outlineBtn: {
color: "#cbd5e1",
border: "1px solid #475569",
backgroundColor: "transparent",
},
activeNavBtn: {
color: "#ffffff",
border: "1px solid #38bdf8",
backgroundColor: "rgba(56, 189, 248, 0.1)",
},
primaryNavBtn: {
backgroundColor: "#2563eb",
color: "#ffffff",
boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
},
logoutNavBtn: {
backgroundColor: "#ef4444",
color: "#ffffff",
boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
},
};
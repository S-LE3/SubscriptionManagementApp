import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Welcome Back</h2>
        <p style={styles.cardSubtitle}>Sign in to manage your active subscriptions</p>

        {message.text && (
          <div style={message.type === "success" ? styles.successAlert : styles.errorAlert}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
container: {
display: "flex",
justifyContent: "center",
alignItems: "center",
minHeight: "calc(100vh - 100px)",
padding: "40px 24px",
},
card: {
backgroundColor: "#ffffff",
padding: "36px",
borderRadius: "16px",
boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
width: "100%",
maxWidth: "420px",
},
cardTitle: {
margin: "0 0 6px 0",
fontSize: "1.6rem",
fontWeight: "700",
color: "#0f172a",
textAlign: "center",
},
cardSubtitle: {
margin: "0 0 24px 0",
color: "#64748b",
fontSize: "0.9rem",
textAlign: "center",
},
form: {
display: "flex",
flexDirection: "column",
gap: "16px",
},
inputGroup: {
display: "flex",
flexDirection: "column",
gap: "6px",
},
label: {
fontSize: "0.85rem",
fontWeight: "600",
color: "#334155",
},
input: {
padding: "11px 14px",
borderRadius: "8px",
border: "1px solid #cbd5e1",
fontSize: "0.95rem",
outline: "none",
color: "#0f172a",
backgroundColor: "#f8fafc",
},
button: {
marginTop: "10px",
padding: "12px",
borderRadius: "8px",
border: "none",
backgroundColor: "#2563eb",
color: "#ffffff",
fontWeight: "600",
fontSize: "1rem",
cursor: "pointer",
},
footerText: {
marginTop: "20px",
textAlign: "center",
fontSize: "0.875rem",
color: "#64748b",
},
link: {
color: "#2563eb",
fontWeight: "600",
textDecoration: "none",
},
successAlert: {
backgroundColor: "#dcfce7",
color: "#15803d",
padding: "10px 14px",
borderRadius: "6px",
fontSize: "0.85rem",
marginBottom: "16px",
},
errorAlert: {
backgroundColor: "#fef2f2",
color: "#b91c1c",
padding: "10px 14px",
borderRadius: "6px",
fontSize: "0.85rem",
marginBottom: "16px",
},
};
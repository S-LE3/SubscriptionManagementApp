import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "customer" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.post("/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      setMessage({ type: "success", text: "Account created! Redirecting..." });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentGrid}>
        <div style={styles.heroSection}>
          <span style={styles.badge}>All-In-One Subscription Tracker</span>
          <h1 style={styles.heroTitle}>Take total control of your recurring payments</h1>
          <p style={styles.heroSubtitle}>
            Never miss a trial expiration, stop unwanted auto-renewals, and optimize your
            monthly budget effortlessly.
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>📊</div>
              <div>
                <h3 style={styles.featureHeading}>Centralized Dashboard</h3>
                <p style={styles.featureDesc}>
                  Track Netflix, Spotify, AWS, and SaaS tools in one clean view.
                </p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🔔</div>
              <div>
                <h3 style={styles.featureHeading}>Smart Billing Alerts</h3>
                <p style={styles.featureDesc}>
                  Get timely notifications before payments hit your card.
                </p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🔒</div>
              <div>
                <h3 style={styles.featureHeading}>Secure Authentication</h3>
                <p style={styles.featureDesc}>
                  JWT-protected sessions keep your subscription data safe.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Create Free Account</h2>
            <p style={styles.cardSubtitle}>Get started with SubTrack in less than a minute.</p>

            {message.text && (
              <div
                style={
                  message.type === "success" ? styles.successAlert : styles.errorAlert
                }
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label htmlFor="name" style={styles.label}>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Creating Account..." : "Get Started Now"}
              </button>
            </form>

            <p style={styles.footerText}>
              Already have an account? {" "}
              <Link to="/login" style={styles.link}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
container: {
maxWidth: "1200px",
margin: "0 auto",
padding: "60px 24px",
},
contentGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
gap: "50px",
alignItems: "center",
},
heroSection: {
display: "flex",
flexDirection: "column",
gap: "20px",
},
badge: {
display: "inline-block",
alignSelf: "flex-start",
backgroundColor: "rgba(56, 189, 248, 0.15)",
color: "#38bdf8",
padding: "6px 14px",
borderRadius: "20px",
fontSize: "0.85rem",
fontWeight: "700",
border: "1px solid rgba(56, 189, 248, 0.3)",
},
heroTitle: {
fontSize: "2.5rem",
fontWeight: "800",
lineHeight: "1.2",
color: "#ffffff",
margin: 0,
},
heroSubtitle: {
fontSize: "1.1rem",
color: "#94a3b8",
lineHeight: "1.6",
margin: 0,
},
featureList: {
display: "flex",
flexDirection: "column",
gap: "20px",
marginTop: "10px",
},
featureItem: {
display: "flex",
gap: "16px",
alignItems: "flex-start",
},
featureIcon: {
fontSize: "1.5rem",
backgroundColor: "#1e293b",
padding: "10px",
borderRadius: "10px",
border: "1px solid #334155",
},
featureHeading: {
color: "#f1f5f9",
fontSize: "1rem",
},
featureDesc: {
color: "#64748b",
fontSize: "0.9rem",
margin: "4px 0 0 0",
},
cardContainer: {
display: "flex",
justifyContent: "center",
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
},
cardSubtitle: {
margin: "0 0 24px 0",
color: "#64748b",
fontSize: "0.9rem",
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
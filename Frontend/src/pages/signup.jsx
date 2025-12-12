import React, { useState } from "react";
import { showToast } from "../lib/toast.js";

export default function Signup({ onDone, onSignedUp }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function notify(msg) {
    if (typeof showToast === "function") return showToast(msg);
    return window.alert(msg);
  }

  // Register user
  async function submit(e) {
    e.preventDefault();
    if (!email || !pw) {
      notify("Please provide email and password.");
      return;
    }

    setLoading(true);

    try {
      // Send registration request
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: pw,
          name: name.trim(),
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        notify(body?.message || "Registration failed. Try again.");
        setLoading(false);
        return;
      }

      notify("Registration successful! Please login.");
      if (typeof onDone === "function") onDone();
    } catch (err) {
      console.error("Signup failed:", err);
      notify(err?.message || "Registration failed. Try again.");
    }

    setLoading(false);
  }

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2>Create account</h2>
        <p style={{ color: "#6b7280" }}>Fill in details to create a new account.</p>

        <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 10 }}>
          <input
            className="auth-input"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />

          <div style={{ display: "flex", gap: 8 }}>
            <button className="auth-primary-btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>

            <button
              type="button"
              className="auth-secondary-btn"
              onClick={() => {
                if (!loading && typeof onDone === "function") onDone();
              }}
              disabled={loading}
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

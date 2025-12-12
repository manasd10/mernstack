import React, { useState } from "react";
import { showToast } from "../lib/toast.js";

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function notify(msg) {
    if (typeof showToast === "function") return showToast(msg);
    return window.alert(msg);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      notify("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        return notify(body?.message || "Invalid credentials.");
      }

      // Extract token
      let token = body?.token;
      if (!token) throw new Error("Token missing from server response");

      // Remove "Bearer"
      if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      }

      // Save token
      localStorage.setItem("token", token);

      notify("Login successful!");
      if (typeof onLoggedIn === "function") onLoggedIn();
    } catch (err) {
      console.error(err);
      notify(err.message || "Login failed.");
    }

    setLoading(false);
  }

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 10 }}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

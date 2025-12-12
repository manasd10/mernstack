import React, { useState } from "react";
import { doFetch } from "../lib/api.js";
import { showToast } from "../lib/toast.js"; 

export default function Register({ onDone, onSignedUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  function notify(msg) {
    if (typeof showToast === "function") return showToast(msg);
    return window.alert(msg);
  }

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !pw) {
      notify("Please complete all fields.");
      return;
    }

    setLoading(true);
    try {
      // change path if your backend uses a different one
      const resBody = await doFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pw }),
      });

      // save and call onSignedUp to move straight to dashboard
      let token = null;
      if (resBody) {
        if (typeof resBody === "string") token = resBody;
        else if (resBody.token) token = resBody.token;
        else if (resBody.accessToken) token = resBody.accessToken;
        else if (resBody.data && (resBody.data.token || resBody.data.accessToken)) token = resBody.data.token || resBody.data.accessToken;
      }

      if (token) {
        // strip Bearer if present, store raw token
        if (token.startsWith("Bearer ")) token = token.replace(/^Bearer\s+/i, "");
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("token_saved_at", String(Date.now()));
        } catch (e) {
          console.warn("Failed to store token locally", e);
        }
        notify("Registered and logged in — welcome!");
        if (typeof onSignedUp === "function") onSignedUp();
        return;
      }

      // (go to login)
      notify("Registration successful. Please login.");
      if (typeof onDone === "function") onDone();
    } catch (err) {
      console.error("Registration failed:", err);
      // show helpful message from server when available
      const msg = err?.body?.message || err?.message || "Registration failed — try again.";
      notify(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 720 }}>
      <h2>Create account</h2>
      <p style={{ color: "#6b7280" }}>Fill in details to create a new account.</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 8 }}>
        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Name</div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        </label>

        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>

        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Password</div>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Choose a strong password" required />
        </label>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              if (typeof onDone === "function") onDone();
            }}
            disabled={loading}
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}

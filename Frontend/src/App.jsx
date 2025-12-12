import React, { useEffect, useState } from "react";

import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import AddExpense from "./pages/addexpenses.jsx";
import Reports from "./pages/report.jsx";

import ThemeToggle from "./components/themetoggle.jsx";

import "./App.css";

//REMOVE WRONG IMPORTS (API, authHeaders DO NOT EXIST)
// import { API, authHeaders } from "./lib/api.js";

export default function App() {
  const [page, setPage] = useState(localStorage.getItem("token") ? "dashboard" : "login");
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "token") {
        const has = !!localStorage.getItem("token");
        setIsAuthed(has);
        setPage(has ? "dashboard" : "login");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthed(false);
    setPage("login");
  }

  function onLoggedIn() {
    setIsAuthed(true);
    setPage("dashboard");
  }

  function Header({ onLogout }) {
    return (
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 21h16V7H4v14z" stroke="white" strokeWidth="1.2" />
              <path d="M8 3h8v4H8V3z" stroke="white" strokeWidth="1.2" />
            </svg>
          </div>

          <div>
            <h1 style={{ margin: 0 }}>Hisab Finance</h1>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
              Personal finance & budgeting
            </p>
          </div>
        </div>

        <nav>
          {isAuthed ? (
            <>
              <button className="small-btn" onClick={() => setPage("dashboard")}>Dashboard</button>
              <button className="small-btn" onClick={() => setPage("add-expense")}>Add</button>
              <button className="small-btn" onClick={() => setPage("reports")}>Reports</button>

              <ThemeToggle />

              <button className="small-btn logout" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="small-btn" onClick={() => setPage("login")}>Login</button>
              <button className="small-btn" onClick={() => setPage("register")}>Create account</button>
            </>
          )}
        </nav>
      </header>
    );
  }

  return (
    <div className="app-wrapper">
      <Header onLogout={handleLogout} />

      <main style={{ marginTop: 20 }}>
        {page === "register" && (
          <Signup onDone={() => setPage("login")} onSignedUp={onLoggedIn} />
        )}

        {page === "login" && <Login onLoggedIn={onLoggedIn} />}

        {page === "dashboard" && (
          <Dashboard
            onAddExpense={() => setPage("add-expense")}
            onViewReports={() => setPage("reports")}
          />
        )}

        {page === "add-expense" && (
          <AddExpense onSaved={() => setPage("dashboard")} onCancel={() => setPage("dashboard")} />
        )}

        {page === "reports" && <Reports onBack={() => setPage("dashboard")} />}
      </main>
    </div>
  );
}

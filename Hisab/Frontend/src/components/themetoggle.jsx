import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Load stored theme OR fall back to light
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle function
  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <button
      className={`pill ${theme === "dark" ? "active" : ""}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{ minWidth: "90px", textAlign: "center" }}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

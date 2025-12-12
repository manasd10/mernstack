import React from "react";

export default function CategoryFilter({ categories = [], value, onChange }) {
  return (
    <select
      className="auth-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ maxWidth: 260 }}
    >
      <option value="">All categories</option>
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

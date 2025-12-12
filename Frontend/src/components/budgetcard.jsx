import React from "react";

export default function BudgetCard({ category, limit = 0, spent = 0, onSet }) {
  const over = spent > limit && limit > 0;
  const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;

  return (
    <div className="card" style={{ marginBottom: 10, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700 }}>{category}</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, color: over ? "#ef4444" : "#0b4f3f" }}>
            ₹{spent}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {limit ? `of ₹${limit}` : "No limit"}
          </div>
        </div>
      </div>

      <div
        style={{
          height: 8,
          background: "#f1f6f1",
          borderRadius: 8,
          marginTop: 8,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: over
              ? "rgba(239,68,68,0.9)"
              : "linear-gradient(90deg,#16a34a,#059669)",
            borderRadius: 8,
          }}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <button className="small-btn" onClick={() => onSet(category)}>
          Set limit
        </button>
      </div>
    </div>
  );
}

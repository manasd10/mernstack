import React from "react";

export default function GoalCard({ title, target, saved, onUpdate }) {
  const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{title}</div>
          <div className="small-muted">Target ₹{target}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800 }}>₹{saved}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{pct}%</div>
        </div>
      </div>

      <div
        style={{
          height: 10,
          background: "#eef6ef",
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg,#f59e0b,#d97706)",
            borderRadius: 8,
          }}
        />
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button className="small-btn" onClick={() => onUpdate("add")}>
          Add
        </button>
        <button className="small-btn" onClick={() => onUpdate("edit")}>
          Edit
        </button>
      </div>
    </div>
  );
}

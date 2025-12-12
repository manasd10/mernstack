import React, { useEffect, useState, useMemo } from "react";

import {
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "../lib/api.js";

import { showToast } from "../lib/toast.js";

import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function Dashboard({ onAddExpense, onViewReports }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(null);

  const toNumber = (v) => Number(v) || 0;

  // FETCH
  async function fetchTx() {
    setLoading(true);
    setError(null);

    try {
      const data = await getTransactions();

      setTransactions(
        data.map((t) => ({
          _id: t._id,
          type: t.type,
          amount: toNumber(t.amount),
          category: t.category,
          notes: t.notes || "",
          date: t.date,
        }))
      );
    } catch (err) {
      setError(err.message || "Failed to load transactions");
      setTransactions([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTx();
  }, []);

  //DELETE
  async function removeTx(id) {
    if (!confirm("Delete transaction?")) return;

    try {
      await deleteTransaction(id);
      await fetchTx();
      showToast("Transaction deleted");
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  //SAVE EDIT
  async function saveEdit() {
    try {
      await updateTransaction(editing._id, editing);
      setEditing(null);
      await fetchTx();
      showToast("Transaction updated");
    } catch (err) {
      alert(err.message || "Update failed");
    }
  }

// SUMMARY CARDS
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  //CATEGORY PIE
  const categoryChart = useMemo(() => {
    const totals = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    });

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          data: Object.values(totals),
          backgroundColor: [
            "#4CAF50",
            "#FF9800",
            "#2196F3",
            "#9C27B0",
            "#FF5722",
          ],
        },
      ],
    };
  }, [transactions]);

  // MONTHLY BAR
  const monthlyChart = useMemo(() => {
    const monthly = {};

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("en-US", { month: "short" });

      if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };

      if (t.type === "income") monthly[month].income += t.amount;
      else monthly[month].expense += t.amount;
    });

    const labels = Object.keys(monthly);

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: labels.map((m) => monthly[m].income),
          backgroundColor: "#4CAF50",
        },
        {
          label: "Expense",
          data: labels.map((m) => monthly[m].expense),
          backgroundColor: "#F44336",
        },
      ],
    };
  }, [transactions]);

  // UI
  return (
    <div className="main-grid" style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button className="pill" onClick={onAddExpense}>
          Add Transaction
        </button>
        <button className="pill" onClick={onViewReports}>
          Reports
        </button>
      </div>

      {}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
        <SummaryCard title="Total Income" value={summary.income} color="#4CAF50" />
        <SummaryCard title="Total Expense" value={summary.expense} color="#F44336" />
        <SummaryCard title="Balance" value={summary.balance} color="#2196F3" />
      </div>

      {}
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <div className="card" style={{ width: 300 }}>
          <h3>Category Split</h3>
          <Doughnut data={categoryChart} />
        </div>

        <div className="card" style={{ width: 500 }}>
          <h3>Income vs Expense</h3>
          <Bar data={monthlyChart} />
        </div>
      </div>

      {}
      <h3 style={{ marginTop: 30 }}>Transactions</h3>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && transactions.length === 0 && <p>No transactions yet.</p>}

      {!loading &&
        transactions.map((t) => (
          <div
            key={t._id}
            className="card"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <span>{t.category}</span>
            <span>{t.type}</span>
            <span>₹{t.amount}</span>
            <span>{new Date(t.date).toLocaleDateString()}</span>

            <button
              className="pill"
              style={{ background: "#2196F3", color: "white" }}
              onClick={() => setEditing({ ...t })}
            >
              Edit
            </button>

            <button
              className="pill"
              style={{ background: "#FF4444", color: "white" }}
              onClick={() => removeTx(t._id)}
            >
              Delete
            </button>
          </div>
        ))}

      {editing && (
        <EditModal editing={editing} setEditing={setEditing} saveEdit={saveEdit} />
      )}
    </div>
  );
}

//SUMMARY CARD
function SummaryCard({ title, value, color }) {
  return (
    <div
      className="card"
      style={{
        flex: 1,
        background: color,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        padding: 20,
        borderRadius: 14,
      }}
    >
      <div>{title}</div>
      <div style={{ fontSize: 26, marginTop: 10 }}>₹{value}</div>
    </div>
  );
}

// EDIT MODAL
function EditModal({ editing, setEditing, saveEdit }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="card" style={{ width: 360, padding: 25, borderRadius: 16 }}>
        <h3>Edit Transaction</h3>

        <label>Amount</label>
        <input
          type="number"
          value={editing.amount}
          onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })}
        />

        <label style={{ marginTop: 10 }}>Type</label>
        <select
          value={editing.type}
          onChange={(e) => setEditing({ ...editing, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <label style={{ marginTop: 10 }}>Category</label>
        <input
          type="text"
          value={editing.category}
          onChange={(e) => setEditing({ ...editing, category: e.target.value })}
        />

        <label style={{ marginTop: 10 }}>Notes</label>
        <textarea
          value={editing.notes}
          onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
          style={{ height: 70, resize: "none" }}
        ></textarea>

        <label style={{ marginTop: 10 }}>Date</label>
        <input
          type="date"
          value={editing.date.split("T")[0]}
          onChange={(e) => setEditing({ ...editing, date: e.target.value })}
        />

        {}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {}
          <button className="pill active" onClick={saveEdit}>
            Save
          </button>

          {}
          <button
            className="pill"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "var(--text)",
            }}
            onClick={() => setEditing(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { createTransaction } from "../lib/api.js";
import { showToast } from "../lib/toast.js"; // optional, if missing file will fallback to alert


 // AddExpense form

function AddExpense({ onSaved, onCancel }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // keep AbortController ref so requests can be canceled on unmount
  const acRef = useRef(null);
  useEffect(() => {
    return () => {
      if (acRef.current) acRef.current.abort();
    };
  }, []);

  function showMessage(msg) {
    if (typeof showToast === "function") showToast(msg);
    else window.alert(msg);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showMessage("Please enter a valid amount greater than 0.");
      return;
    }
    if (!date) {
      showMessage("Please choose a date.");
      return;
    }

    const payload = {
      amount: Number(amount),
      type,
      category,
      date,
      note: (notes || "").trim(),
    };

    setLoading(true);
    const controller = new AbortController();
    acRef.current = controller;

    try {
      const created = await createTransaction(payload, controller.signal);

      // success
      setLoading(false);
      showMessage("Saved ✔");

      // If API returned created transaction, pass it back to parent; else parent can refresh
      if (created && typeof onSaved === "function") onSaved(created);
      else if (typeof onSaved === "function") onSaved();
    } catch (err) {
      setLoading(false);

      
      if (err && err.body) {
        console.debug("[AddExpense] server error body:", err.body);
      } else {
        console.debug("[AddExpense] error:", err);
      }

      // AUTH / 401 / 403: ask user to confirm re-login instead of immediately clearing token
      if (err && (err.type === "auth" || err.status === 401 || err.status === 403)) {
        const serverMsg = err.body?.message || err.message || "Your session may have expired.";
        const relogin = window.confirm(
          `${serverMsg}\n\nPress OK to re-login (this will clear saved session), or Cancel to stay on this page.`
        );
        if (relogin) {
          try { localStorage.removeItem("token"); } catch {}
          // reload so App.jsx shows login
          window.location.reload();
          return;
        } else {
          // user chose not to re-login — do not clear token automatically
          return;
        }
      }

      // Network error
      if (err && err.type === "network") {
        showMessage("Network error — check your connection.");
      } else if (err && err.status === 404) {
        showMessage("Server route not found (404). Check API path.");
      } else if (err && err.message) {
        showMessage(err.message);
      } else {
        showMessage("Failed to save transaction. Try again.");
      }
    } finally {
      acRef.current = null;
    }
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 920 }}>
        <h2>Add Transaction</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <div className="form-row" style={{ marginBottom: 14 }}>
            <div className="col">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="col">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-row" style={{ marginBottom: 14 }}>
            <div className="col">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="col">
              <label>Notes</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                if (!loading && typeof onCancel === "function") onCancel();
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;

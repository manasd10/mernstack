const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

//GET ALL TRANSACTIONS
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction
      .find({ userId: req.user.id })
      .sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("Get transactions failed:", err);
    res.status(500).json({ message: "Failed to load transactions" });
  }
});


//CREATE TRANSACTION
router.post("/", async (req, res) => {
  try {
    const tx = await Transaction.create({
      userId: req.user.id,
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category,
      notes: req.body.notes || "",
      date: new Date(req.body.date),
    });

    res.json(tx);
  } catch (err) {
    console.error("Create transaction error:", err);
    res.status(400).json({ message: "Failed to create transaction" });
  }
});


//UPDATE TRANSACTION
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        amount: req.body.amount,
        type: req.body.type,
        category: req.body.category,
        notes: req.body.notes || "",
        date: new Date(req.body.date),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});


//DELETE TRANSACTION
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Delete transaction error:", err);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

module.exports = router;

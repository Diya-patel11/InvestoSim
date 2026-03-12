const express = require("express");
const router = express.Router();
const Portfolio = require("../model/Portfolio");
const Transaction = require("../model/Transaction");
const mongoose = require("mongoose");

// Buy Stock
router.post("/buy", async (req, res) => {
  try {
    const { userId, stockSymbol, companyName, quantity, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    if (!stockSymbol || !companyName || !quantity || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const totalCost = quantity * price;

    let portfolio = await Portfolio.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    if (portfolio.availableCash < totalCost) {
      return res.status(400).json({ error: "Not enough cash to buy stocks" });
    }

    let stockIndex = portfolio.stocks.findIndex((s) => s.stockSymbol === stockSymbol);

    if (stockIndex !== -1) {
      portfolio.stocks[stockIndex].quantity += quantity;
      portfolio.stocks[stockIndex].avgPrice =
        (portfolio.stocks[stockIndex].avgPrice * portfolio.stocks[stockIndex].quantity + price * quantity) /
        (portfolio.stocks[stockIndex].quantity + quantity);
    } else {
      portfolio.stocks.push({ stockSymbol, companyName, quantity, avgPrice: price });
    }

    portfolio.availableCash -= totalCost;
    portfolio.portfolioValue += totalCost;

    await portfolio.save();

    // Create transaction
    const newTransaction = new Transaction({
      userId: new mongoose.Types.ObjectId(userId), // ✅ Ensure userId is saved as ObjectId
      stockSymbol,
      companyName,
      transactionType: "BUY",
      quantity,
      price,
      totalAmount: totalCost
    });

    await newTransaction.save();

    res.status(201).json({ message: "Stock purchased successfully", portfolio, transaction: newTransaction });
  } catch (error) {
    console.error("Buy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Sell Stock
router.post("/sell", async (req, res) => {
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    if (!stockSymbol || !quantity || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let portfolio = await Portfolio.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const stockIndex = portfolio.stocks.findIndex((s) => s.stockSymbol === stockSymbol);

    if (stockIndex === -1) {
      return res.status(400).json({ error: "Stock not found in portfolio" });
    }

    const stock = portfolio.stocks[stockIndex];

    if (stock.quantity < quantity) {
      return res.status(400).json({ error: "Not enough shares to sell" });
    }

    const totalSale = quantity * price;

    stock.quantity -= quantity;
    if (stock.quantity === 0) {
      portfolio.stocks.splice(stockIndex, 1);
    }

    portfolio.availableCash += totalSale;
    portfolio.portfolioValue -= quantity * stock.avgPrice;

    await portfolio.save();

    const newTransaction = new Transaction({
      userId: new mongoose.Types.ObjectId(userId), // ✅ Ensure userId is saved as ObjectId
      stockSymbol,
      companyName: stock.companyName,
      transactionType: "SELL",
      quantity,
      price,
      totalAmount: totalSale
    });

    await newTransaction.save();

    res.status(200).json({ message: "Stock sold successfully", portfolio, transaction: newTransaction });
  } catch (error) {
    console.error("Sell Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ FIXED: Get Transactions Route
//router.get("/transactions/:userId", async (req, res) => {
  router.get("/:userId", async (req, res) => { // ✅ Fix the route path

  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    console.log("Fetching transactions for user:", userId);

    const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) });

    if (!transactions.length) {
      return res.status(404).json({ error: "No transactions found" }); // ❌ Error if no transactions
    }

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;




const express = require("express");
const router = express.Router();
const Portfolio = require("../model/Portfolio");
const Transaction = require('../model/Transaction');
const mongoose = require("mongoose");
const fetchLivePrice = require('../utils/fetchLivePrice');

//const User = require('../models/user'); // or the correct path


// Get User Portfolio
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    let portfolio = await Portfolio.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!portfolio) {
      portfolio = new Portfolio({ userId, availableCash: 1000000, portfolioValue: 0, stocks: [] });
      await portfolio.save();
    }

    res.status(200).json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Portfolio
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { availableCash, portfolioValue } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    if (typeof availableCash !== "number" || typeof portfolioValue !== "number") {
      return res.status(400).json({ error: "Invalid input. Cash and portfolio value must be numbers." });
    }

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { availableCash, portfolioValue },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedPortfolio);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Summary: Portfolio Value, Cash, Today's Change
router.get('/summary/:userId', async (req, res) => {
  try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID" });
      }

      let portfolio = await Portfolio.findOne({ userId: new mongoose.Types.ObjectId(userId) });

      if (!portfolio) {
        portfolio = new Portfolio({ userId, availableCash: 1000000, portfolioValue: 0, stocks: [] });
        await portfolio.save();
      }

      const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) });

      let holdingsValue = 0;
      let todaysChange = 0;

      for (let stock of portfolio.stocks) {
          const { symbol, quantity, averagePrice } = stock;
          const livePrice = await fetchLivePrice(symbol);

          const currentValue = livePrice * quantity;
          const change = (livePrice - averagePrice) * quantity;

          holdingsValue += currentValue;
          todaysChange += change;
      }

      const totalValue = holdingsValue + portfolio.availableCash;

      res.json({
          accountValue: totalValue.toFixed(2),
          todaysChange: todaysChange.toFixed(2)
      });
  } catch (error) {
      console.error("Error fetching portfolio summary:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// Chart Data: Historical & Allocation
router.get('/chart-data/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      //const portfolio = await Portfolio.findOne({ user: userId });
      const portfolio = await Portfolio.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID" });
      }
      
      // Allocation by stock symbol
      const allocation = {
          labels: [],
          values: []
      };

      for (let stock of portfolio.stocks) {
          allocation.labels.push(stock.symbol);
          const livePrice = await fetchLivePrice(stock.symbol);
          allocation.values.push(livePrice * stock.quantity);
      }

      // Mock performance chart (replace with DB-stored values if available)
      const performance = {
          dates: ['Day 1', 'Day 2', 'Day 3', 'Today'],
          values: [9500, 10000, 10200, allocation.values.reduce((a, b) => a + b, portfolio.availableCash)]
      };

      res.json({ allocation, performance });

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

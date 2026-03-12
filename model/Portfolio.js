
const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  stockSymbol: { type: String, required: true },
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgPrice: { type: Number, required: true }
});

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availableCash: { type: Number, required: true, default: 1000000 },//changes here
  portfolioValue: { type: Number, required: true, default: 0 },
  stocks: { type: [StockSchema], default: [] }
});

// ✅ Fix: Check if model already exists before defining it
const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

module.exports = Portfolio;

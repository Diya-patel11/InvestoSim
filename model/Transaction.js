
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stockSymbol: { type: String, required: true },
  companyName: { type: String, required: true },
  transactionType: { type: String, enum: ["BUY", "SELL"], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Auto-calculate totalAmount before saving
transactionSchema.pre("save", function (next) {
  this.totalAmount = this.quantity * this.price;
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
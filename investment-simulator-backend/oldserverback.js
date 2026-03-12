require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
const PORT = 5000;
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/investosim", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("✅ MongoDB Connected!"));

// **User Schema**
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// **Trade Schema**
const TradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stockSymbol: { type: String, required: true },
  stockName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ["buy", "sell"], required: true },
  date: { type: Date, default: Date.now }
});
const Trade = mongoose.model("Trade", TradeSchema);

// **Portfolio Schema**
const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stockSymbol: { type: String, required: true },
  stockName: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
});
const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

// **Register API**
/*app.post("api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});*/
// 🔹 Registration Route
app.post("/register", async (req, res) => {
  try {
      const { username, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: "User already exists!" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save new user
      user = new User({ username, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "Registration successful!", userId: user._id });
  } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ error: "Server error" });
  }
});

// **Login API**
/*app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user: { _id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});*/


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User not found!" });
      }

      if (user.password !== password) {
          return res.status(401).json({ message: "Invalid credentials!" });
      }

      // Send userId in the response
      res.json({
          userId: user._id,   // Make sure _id is correctly retrieved
          message: "Login successful!"
      });
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error!" });
  }
});

// **Middleware for Authentication**
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// **Get User Portfolio**
app.get("/portfolio", authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user._id });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: "Error fetching portfolio" });
  }
});

// **Get User Trade History**
app.get("/trades", authMiddleware, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: "Error fetching trade history" });
  }
});

// **Protected Dashboard Route**
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the dashboard", user: req.user });
});

// **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

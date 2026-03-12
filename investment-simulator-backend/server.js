require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const NodeCache = require("node-cache");
const authRoutes = require("./route/authRoute");  // ✅ Ensure correct path

const app = express();
const PORT = 5000;
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Middleware
app.use(express.json());
app.use(cors());

// 🔹 MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/investosim")
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 🔹 Use Auth Routes
app.use("/api", authRoutes);

// 🔹 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

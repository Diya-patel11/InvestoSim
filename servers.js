require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//require("dotenv").config();

//const express = require("express");
//const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const cors = require("cors");
const axios = require("axios");
const NodeCache = require("node-cache");

// ✅ Load Environment Variables
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;


// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit if DB connection fails
});

// ✅ Import Routes
const transactionRoutes = require('./routes/transactionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const accountRoutes = require('./routes/accountRoutes');
//const stockPriceRoutes = require('./routes/stockPriceRoutes');


// ✅ Use Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/account-summary", accountRoutes);
app.use("/api", accountRoutes);

// Mount the route
//app.use('/api', stockPriceRoutes);

//app.listen(PORT, () => {
//  console.log(`Server running on http://localhost:${PORT}`);
//});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

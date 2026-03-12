const express = require('express');
const router = express.Router();
const Transaction = require('../model/Transaction'); // Ensure correct model path
const Portfolio = require('../model/Portfolio'); // Ensure correct model path

//router.get('/:userId', async (req, res) => {
/*router.get("/account/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Fetching account summary for user: ${userId}`);

        // ✅ Step 1: Fetch Portfolio to Calculate Portfolio Value
        //const portfolio = await Portfolio.find({ userId });
        const portfolio = await Portfolio.findOne({ userId });


        let portfolioValue = 0;
        portfolio.forEach(stock => {
            portfolioValue += stock.currentPrice * stock.quantity;
        });

        // ✅ Step 2: Fetch Transactions to Calculate Available Cash
        const transactions = await Transaction.find({ userId });

        let availableCash = 5000000; // Initial Cash ₹50,00,000
        transactions.forEach(tx => {
            if (tx.type === 'buy') {
                availableCash -= tx.price * tx.quantity;
            } else if (tx.type === 'sell') {
                availableCash += tx.price * tx.quantity;
            }
        });

        // ✅ Step 3: Send Data to Frontend
        res.json({
            userId,
            availableCash,
            portfolioValue
        });

    } catch (error) {
        console.error('❌ Error fetching account summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});*/
/*router.get("/account/:userId", async (req, res) => {
    console.log("🔍 Account Summary API called with userId:", req.params.userId);
    
    try {
        const userId = req.params.userId;
        const portfolio = await Portfolio.findOne({ userId: userId });

        if (!portfolio) {
            console.log("❌ Portfolio not found for userId:", userId);
            return res.status(404).json({ message: "Portfolio not found" });
        }

        console.log("✅ Found portfolio:", portfolio);
        res.json({
            userId: portfolio.userId,
            availableCash: portfolio.availableCash,
            portfolioValue: portfolio.portfolioValue
        });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
*/
router.get("/account/:userId", async (req, res) => {
    console.log("🔍 Account Summary API called with userId:", req.params.userId);

    const userId = req.params.userId;

    if (!userId || userId === "undefined") {
        console.log("❌ Missing or invalid userId in request!");
        return res.status(400).json({ message: "Invalid userId" });
    }

    try {
        const portfolio = await Portfolio.findOne({ userId: userId });

        if (!portfolio) {
            console.log("❌ Portfolio not found for userId:", userId);
            return res.status(404).json({ message: "Portfolio not found" });
        }

        console.log("✅ Found portfolio:", portfolio);
        res.json({
            userId: portfolio.userId,
            availableCash: portfolio.availableCash,
            portfolioValue: portfolio.portfolioValue
        });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;

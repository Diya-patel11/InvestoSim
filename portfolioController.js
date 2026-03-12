//for chart
// portfolioController.js

// Get portfolio data for charts
exports.getPortfolioChartData = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // 1. Get portfolio
        const portfolio = await Portfolio.findOne({ userId })
            .populate('stocks')
            .lean();
        
        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found" });
        }

        // 2. Get transaction history (last 30 days)
        const transactions = await Transaction.find({ 
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: 1 });
        
        // 3. Calculate performance data
        const performance = {
            labels: [],
            values: []
        };
        
        let runningValue = portfolio.availableCash;
        transactions.forEach(tx => {
            performance.labels.push(tx.date.toLocaleDateString());
            runningValue += tx.transactionType === 'buy' ? -tx.totalAmount : tx.totalAmount;
            performance.values.push(runningValue);
        });

        // 4. Calculate allocation data
        const allocation = {
            labels: ['Cash'],
            values: [portfolio.availableCash]
        };
        
        portfolio.stocks.forEach(stock => {
            allocation.labels.push(stock.companyName);
            allocation.values.push(stock.quantity * stock.avgPrice);
        });

        res.json({
            performance,
            allocation
        });
        
    } catch (error) {
        console.error("Error getting portfolio chart data:", error);
        res.status(500).json({ error: "Server error" });
    }
};
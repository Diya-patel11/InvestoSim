// Constants
/*const API_KEY = "P31QS86B14MHVVWC";
const API_BASE_URL = "https://www.alphavantage.co/query";
let stockList = [];
let currentStockSymbol = "";
let currentStockName = "";

// Initialize user data
const userId = localStorage.getItem("userId");
if (!localStorage.getItem("availableCash")) {
    localStorage.setItem("availableCash", 5000000);
}
if (!localStorage.getItem("portfolioValue")) {
    localStorage.setItem("portfolioValue", 0);
}

// Load NSE & BSE stock symbols
async function loadStockSymbols() {
    try {
        const response = await fetch("indian_stocks.json");
        stockList = await response.json();
    } catch (error) {
        console.error("Error loading stock symbols:", error);
    }
}

// Search stocks
function searchStocks() {
    let query = document.getElementById("stock-symbol").value.trim().toUpperCase();
    let suggestionsDiv = document.getElementById("suggestions");

    if (query.length < 2) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    let results = stockList
        .filter(stock => stock.name.toUpperCase().includes(query) || stock.symbol.toUpperCase().includes(query))
        .slice(0, 10);

    suggestionsDiv.innerHTML = results.length === 0 
        ? "<div>No results found</div>"
        : results.map(stock => `<div onclick="selectStock('${stock.symbol}', '${stock.name}')">${stock.name} (${stock.symbol})</div>`).join("");
}

// Select stock from suggestions
function selectStock(symbol, name) {
    currentStockSymbol = symbol;
    currentStockName = name;
    document.getElementById("stock-symbol").value = `${name} (${symbol})`;
    document.getElementById("suggestions").innerHTML = "";
    fetchStockData();
}

// Fetch stock data alpha vantage one
/*async function fetchStockData() {
    const symbolInput = document.getElementById("stock-symbol").value.trim();
    if (!currentStockSymbol && symbolInput) {
        const match = symbolInput.match(/\((.*?)\)/);
        currentStockSymbol = match ? match[1] : symbolInput;
    }

    if (!currentStockSymbol) {
        alert("Please select a stock first");
        return;
    }

    document.getElementById("stock-details").style.display = "block";
    document.getElementById("stock-name").innerText = `${currentStockName || currentStockSymbol}`;
    document.getElementById("stock-price").innerText = "Loading...";
    document.getElementById("stock-change").innerText = "Loading...";
    document.getElementById("stock-volume").innerText = "Loading...";

    try {
        // Try NSE first
        let response = await fetch(`${API_BASE_URL}?function=GLOBAL_QUOTE&symbol=${currentStockSymbol}.NSE&apikey=${API_KEY}`);
        let stockData = await response.json();
        let exchange = 'NSE';

        // If NSE data is empty, try BSE
        if (!stockData["Global Quote"] || Object.keys(stockData["Global Quote"]).length === 0) {
            response = await fetch(`${API_BASE_URL}?function=GLOBAL_QUOTE&symbol=${currentStockSymbol}.BSE&apikey=${API_KEY}`);
            stockData = await response.json();
            exchange = 'BSE';
        }

        if (!stockData["Global Quote"] || Object.keys(stockData["Global Quote"]).length === 0) {
            throw new Error("Stock data not available");
        }

        const stock = stockData["Global Quote"];
        document.getElementById("stock-name").innerText = `${currentStockName || currentStockSymbol} (${exchange})`;
        document.getElementById("stock-price").innerText = `Price: ₹${stock["05. price"]}`;
        document.getElementById("stock-change").innerText = `Change: ${stock["09. change"]} (${stock["10. change percent"]})`;
        document.getElementById("stock-volume").innerText = `Volume: ${stock["06. volume"]}`;

        // Load TradingView chart
        loadTradingViewWidget(currentStockSymbol, exchange);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("stock-price").innerText = "Price: --";
        document.getElementById("stock-change").innerText = "Change: --";
        document.getElementById("stock-volume").innerText = "Volume: --";
        alert("Failed to fetch stock data. Please try another stock.");
    }
}before one*/

/*async function fetchStockData() {
    const symbolInput = document.getElementById("stock-symbol").value.trim();
    if (!currentStockSymbol && symbolInput) {
        const match = symbolInput.match(/\((.*?)\)/);
        currentStockSymbol = match ? match[1] : symbolInput;
    }

    if (!currentStockSymbol) {
        alert("Please select a stock first");
        return;
    }

    document.getElementById("stock-details").style.display = "block";
    document.getElementById("stock-name").innerText = `${currentStockName || currentStockSymbol}`;
    document.getElementById("stock-price").innerText = "Loading...";
    document.getElementById("stock-change").innerText = "Loading...";
    document.getElementById("stock-volume").innerText = "Loading...";

    try {
        // Fetch stock data from the Flask API (updated endpoint)
        let response = await fetch(`http://127.0.0.1:5002/stock/${currentStockSymbol}`);
        let stockData = await response.json();

        if (stockData.error) {
            throw new Error(stockData.error);
        }

        // Update UI with the stock data
        document.getElementById("stock-name").innerText = `${stockData.name || currentStockSymbol}`;
        document.getElementById("stock-price").innerText = `Price: ₹${stockData.price}`;
        document.getElementById("stock-change").innerText = `Change: ${stockData.change} (${stockData.changePercent}%)`;
        document.getElementById("stock-volume").innerText = `Volume: ${stockData.volume}`;

        // Load TradingView chart
        loadTradingViewWidget(currentStockSymbol, 'NSE');
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("stock-price").innerText = "Price: --";
        document.getElementById("stock-change").innerText = "Change: --";
        document.getElementById("stock-volume").innerText = "Volume: --";
        alert("Failed to fetch stock data. Please try another stock.");
    }
}


// TradingView Widget
// TradingView Widget Loader for Indian Stocks
function loadTradingViewWidget(symbol, exchange = 'NSE') {
    const container = document.getElementById('tradingview-chart');
    container.innerHTML = ''; // Clear previous chart
    
    // Create widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new TradingView.widget({
        "autosize": true,
        "symbol": `${exchange}:${symbol}`,
        "interval": "D",
        "timezone": "Asia/Kolkata",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview-chart",
        "details": true,
        "hotlist": true,
        "calendar": true,
        "studies": [
          "MACD@tv-basicstudies",
          "RSI@tv-basicstudies"
        ],
        "overrides": {
          "paneProperties.background": "#ffffff",
          "mainSeriesProperties.candleStyle.upColor": "#089981",
          "mainSeriesProperties.candleStyle.downColor": "#f23645"
        }
      });
    };
    document.head.appendChild(script);
  }
  */
//Constants
const API_KEY = "P31QS86B14MHVVWC";
const API_BASE_URL = "https://www.alphavantage.co/query";
const LOCAL_API_URL = "http://127.0.0.1:5002/stock";
const TRANSACTION_API_URL = "http://localhost:5001/api/transactions";
const ACCOUNT_API_URL = "http://localhost:5001/api/account";

let stockList = [];
let currentStockSymbol = "";
let currentStockName = "";
let currentStockPrice = 0;

// Initialize user data
function initializeUserData() {
    if (!localStorage.getItem("userId")) {
        // Redirect to login if no user ID found
        window.location.href = "login.html";
        return;
    }

    if (!localStorage.getItem("availableCash")) {
        localStorage.setItem("availableCash", 1000000);
    }
    if (!localStorage.getItem("portfolioValue")) {
        localStorage.setItem("portfolioValue", 0);
    }
}

// Load NSE & BSE stock symbols
async function loadStockSymbols() {
    try {
        const response = await fetch("indian_stocks.json");
        if (!response.ok) {
            throw new Error(`Failed to load stock symbols: ${response.status}`);
        }
        stockList = await response.json();
        console.log(`Loaded ${stockList.length} stock symbols`);
    } catch (error) {
        console.error("Error loading stock symbols:", error);
        showNotification("Failed to load stock symbols. Some features may not work.", "error");
    }
}

// Search stocks and display suggestions
function searchStocks() {
    const query = document.getElementById("stock-symbol").value.trim().toUpperCase();
    const suggestionsDiv = document.getElementById("suggestions");

    if (query.length < 2) {
        suggestionsDiv.innerHTML = "";
        suggestionsDiv.style.display = "none";
        return;
    }

    const results = stockList
        .filter(stock => 
            stock.name.toUpperCase().includes(query) || 
            stock.symbol.toUpperCase().includes(query)
        )
        .slice(0, 10);

    if (results.length === 0) {
        suggestionsDiv.innerHTML = "<div class='suggestion-item'>No results found</div>";
    } else {
        suggestionsDiv.innerHTML = results.map(stock => 
            `<div class="suggestion-item" onclick="selectStock('${stock.symbol}', '${stock.name.replace(/'/g, "\\'")}')">
                ${stock.name} (${stock.symbol})
            </div>`
        ).join("");
    }
    suggestionsDiv.style.display = "block";
}

// Select stock from suggestions
function selectStock(symbol, name) {
    currentStockSymbol = symbol;
    currentStockName = name;
    document.getElementById("stock-symbol").value = `${name} (${symbol})`;
    document.getElementById("suggestions").innerHTML = "";
    document.getElementById("suggestions").style.display = "none";
    fetchStockData();
}

// Fetch stock data with fallback mechanisms
async function fetchStockData() {
    const symbolInput = document.getElementById("stock-symbol").value.trim();
    
    // Extract symbol from input if not already set
    if (!currentStockSymbol && symbolInput) {
        const match = symbolInput.match(/\((.*?)\)/);
        currentStockSymbol = match ? match[1] : symbolInput;
    }

    if (!currentStockSymbol) {
        showNotification("Please select a stock first", "error");
        return;
    }

    // Show loading state
    document.getElementById("stock-details").style.display = "block";
    document.getElementById("stock-name").innerText = `${currentStockName || currentStockSymbol}`;
    document.getElementById("stock-price").innerText = "Loading...";
    document.getElementById("stock-change").innerText = "Loading...";
    document.getElementById("stock-volume").innerText = "Loading...";
    document.getElementById("tradingview-chart").innerHTML = "<div class='loading-chart'>Loading chart...</div>";

    try {
        // Try local API first
        let stockData = await fetchLocalStockData(currentStockSymbol);
        
        if (!stockData) {
            // Fallback to Alpha Vantage if local API fails
            stockData = await fetchAlphaVantageData(currentStockSymbol);
        }

        if (!stockData) {
            throw new Error("No stock data available from any source");
        }

        // Update UI with the stock data
        updateStockUI(stockData);
        
        // Load TradingView chart
        updateTradingViewWidget(currentStockSymbol, stockData.exchange || 'NSE');

        //updateTradingViewLink(currentStockSymbol, stockData.exchange || 'NSE');

        

    } catch (error) {
        console.error("Error fetching stock data:", error);
        handleStockDataError(error);
    }
}

// Fetch stock data from local API
async function fetchLocalStockData(symbol) {
    try {
        const response = await fetch(`${LOCAL_API_URL}/${symbol}`);
        if (!response.ok) {
            throw new Error(`Local API error: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return {
            name: data.name || symbol,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            volume: data.volume
        };
    } catch (error) {
        console.warn("Local API fetch failed, trying fallback:", error);
        return null;
    }
}

// Fetch stock data from Alpha Vantage as fallback
async function fetchAlphaVantageData(symbol) {
    try {
        // Try NSE first
        let response = await fetch(`${API_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}.NSE&apikey=${API_KEY}`);
        let data = await response.json();
        
        if (data["Global Quote"] && Object.keys(data["Global Quote"]).length > 0) {
            const stock = data["Global Quote"];
            return {
                name: symbol,
                price: stock["05. price"],
                change: stock["09. change"],
                changePercent: stock["10. change percent"],
                volume: stock["06. volume"],
                exchange: 'NSE'
            };
        }
        
        // Try BSE if NSE fails
        response = await fetch(`${API_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${API_KEY}`);
        data = await response.json();
        
        if (data["Global Quote"] && Object.keys(data["Global Quote"]).length > 0) {
            const stock = data["Global Quote"];
            return {
                name: symbol,
                price: stock["05. price"],
                change: stock["09. change"],
                changePercent: stock["10. change percent"],
                volume: stock["06. volume"],
                exchange: 'BSE'
            };
        }
        
        throw new Error("No data from Alpha Vantage");
    } catch (error) {
        console.error("Alpha Vantage fetch failed:", error);
        return null;
    }
}
// [Keep all your existing code above exactly as is until the updateStockUI function]

// Updated TradingView-related functions only:
function updateStockUI(stockData) {
    document.getElementById("stock-name").innerText = `${stockData.name}${stockData.exchange ? ` (${stockData.exchange})` : ''}`;
    document.getElementById("stock-price").innerText = `Price: ₹${formatNumber(stockData.price)}`;
    document.getElementById("stock-change").innerText = `Change: ${formatNumber(stockData.change)} (${stockData.changePercent})`;
    document.getElementById("stock-volume").innerText = `Volume: ${formatNumber(stockData.volume)}`;
    
    currentStockPrice = parseFloat(stockData.price) || 0;
    
    // Enhanced TradingView link display
    updateTradingViewWidget(currentStockSymbol, stockData.exchange || 'NSE');
}

// New improved TradingView widget function
/*function updateTradingViewWidget(symbol, exchange = 'NSE') {
    const container = document.getElementById("tradingview-chart");
    const tvSymbol = `${exchange}:${symbol}`;
    const chartLink = `https://www.tradingview.com/chart/?symbol=${tvSymbol}`;
    const symbolLink = `https://www.tradingview.com/symbols/${exchange}-${symbol}/`;
    //const snapshotLink = `https://www.tradingview.com/symbols/${exchange}-${symbol}/technicals/`;

    container.innerHTML = `
        <div class="tradingview-widget">
            <div class="tv-header">
                <span class="tv-logo">📈</span>
                <h4>Advanced Chart</h4>
            </div>
            <div class="tv-links">
                <a href="${chartLink}" target="_blank" class="tv-link">
                    Open Interactive Chart
                </a>
                <a href="${symbolLink}" target="_blank" class="tv-link">
                    View Stock Overview
                </a>
            </div>
            <div class="tv-symbol-info">
                <p>TradingView Symbol: <strong>${tvSymbol}</strong></p>
            </div>
        </div>
    `;
}*/
function updateTradingViewWidget(symbol, exchange = 'NSE') {
    const container = document.getElementById("tradingview-chart");
    const tvSymbol = `${exchange}:${symbol}`;
    const chartLink = `https://www.tradingview.com/chart/?symbol=${tvSymbol}`;
    const symbolLink = `https://www.tradingview.com/symbols/${exchange}-${symbol}/`;
    const snapshotLink = `https://www.tradingview.com/symbols/${exchange}-${symbol}/technicals/`;

    container.innerHTML = `
        <div class="tradingview-widget">
            <div class="tv-header">
                <span class="tv-logo">📈</span>
                <h4>Stock Chart & Info</h4>
            </div>
            <div class="tv-links">
                <a href="${chartLink}" target="_blank" class="tv-link">
                    🔴 Open Live Chart
                </a><br>
                <a href="${symbolLink}" target="_blank" class="tv-link">
                    📄 View Stock Overview
                </a><br>
                <a href="${snapshotLink}" target="_blank" class="tv-link">
                    📈 Technical Snapshot
                </a>
            </div>
            <div class="tv-symbol-info">
                <p>TradingView Symbol: <strong>${tvSymbol}</strong></p>
            </div>
        </div>
    `;
}



// Updated error handling with better TradingView links
function handleStockDataError(error) {
    document.getElementById("stock-price").innerText = "Price: --";
    document.getElementById("stock-change").innerText = "Change: --";
    document.getElementById("stock-volume").innerText = "Volume: --";
    
    const symbol = currentStockSymbol || 'SYMBOL';
    const container = document.getElementById("tradingview-chart");
    
    container.innerHTML = `
        <div class="tv-error">
            <p>❌ Couldn't load chart data for ${symbol}</p>
            <div class="tv-fallback-links">
                <p>Try these links instead:</p>
                <a href="https://www.tradingview.com/chart/?symbol=NSE:${symbol}" target="_blank">
                    NSE Chart
                </a>
                <a href="https://www.tradingview.com/chart/?symbol=BSE:${symbol}" target="_blank">
                    BSE Chart
                </a>
                <a href="https://www.tradingview.com/search/?q=${symbol}" target="_blank">
                    Search on TradingView
                </a>
            </div>
        </div>
    `;
    
    showNotification(`Failed to fetch stock data: ${error.message || 'Unknown error'}`, "error");
}


// Place an order (buy/sell)
async function placeOrder() {
    const action = document.getElementById("trade-action").value;
    const quantity = parseInt(document.getElementById("trade-quantity").value, 10);
    const orderType = document.getElementById("order-type").value;
    const stockInput = document.getElementById("stock-symbol").value.trim();

    // Validate inputs
    if (!validateOrderInputs(action, quantity, stockInput)) {
        return;
    }

    // Extract stock symbol and name
    const stockParts = stockInput.split(" - ");
    const stockSymbol = currentStockSymbol || stockParts[0];
    const companyName = currentStockName || stockParts[1] || stockSymbol;

    // Get current price
    const stockPrice = currentStockPrice || parseFloat(
        document.getElementById("stock-price").textContent
            .replace("Price: ₹", "")
            .replace(/,/g, "")
    );

    if (isNaN(stockPrice)) {
        showNotification("Unable to fetch stock price. Please try again.", "error");
        return;
    }

    const totalCost = stockPrice * quantity;

    // Show order preview
    if (!confirmOrderPreview(action, stockSymbol, companyName, quantity, stockPrice, totalCost, orderType)) {
        return;
    }

    // Execute trade
    await executeTrade(action, stockSymbol, companyName, quantity, stockPrice);
}

// Validate order inputs
function validateOrderInputs(action, quantity, stockInput) {
    if (!stockInput) {
        showNotification("Please select a stock first", "error");
        return false;
    }

    if (isNaN(quantity) || quantity <= 0) {
        showNotification("Please enter a valid quantity", "error");
        return false;
    }

    return true;
}

// Show order preview confirmation
function confirmOrderPreview(action, symbol, name, quantity, price, total, orderType) {
    const previewMessage = `
        Order Preview:
        - Action: ${action.toUpperCase()}
        - Stock: ${name} (${symbol})
        - Quantity: ${quantity}
        - Price per Share: ₹${price.toFixed(2)}
        - Total ${action === 'buy' ? 'Cost' : 'Value'}: ₹${total.toFixed(2)}
        - Order Type: ${orderType}
    `;

    return confirm(`${previewMessage}\n\nDo you want to proceed with this order?`);
}

// Execute a trade (buy/sell)
async function executeTrade(action, stockSymbol, companyName, quantity, price) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        showNotification("User ID not found. Please log in again.", "error");
        return;
    }

    showNotification(`Processing ${action} order...`, "info");

    try {
        const endpoint = action === "buy" ? "/buy" : "/sell";
        const payload = {
            userId,
            stockSymbol,
            companyName,
            quantity,
            price
        };

        const response = await fetch(`${TRANSACTION_API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Failed to execute trade");
        }

        showNotification(`Trade executed successfully! ${action.toUpperCase()} ${quantity} shares of ${stockSymbol}`, "success");
        
        // Refresh data
        fetchTransactions();
        fetchPortfolio();
        fetchAccountSummary();
    } catch (error) {
        console.error("Error executing trade:", error);
        showNotification(`Failed to execute trade: ${error.message}`, "error");
    }
}

// Fetch and display account summary
async function fetchAccountSummary() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found!");
        return;
    }

    try {
        const response = await fetch(`${ACCOUNT_API_URL}/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        updateAccountUI(data);
    } catch (error) {
        console.error("Error fetching account summary:", error);
        showNotification("Failed to load account summary", "error");
    }
}

// Update account UI
function updateAccountUI(data) {
    document.getElementById("user-id").innerText = `${data.userId || "N/A"}`;
    document.getElementById("available-cash").innerText = `₹${formatNumber(data.availableCash)}`;
    document.getElementById("portfolio-value").innerText = `₹${formatNumber(data.portfolioValue)}`;
}

// Fetch and display transactions
async function fetchTransactions() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found!");
        return;
    }

    try {
        const response = await fetch(`${TRANSACTION_API_URL}/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const transactions = await response.json();
        displayTransactions(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        showNotification("Failed to load transactions", "error");
    }
}

// Display transactions in the table
function displayTransactions(transactions) {
    const transactionTableBody = document.getElementById("transaction-list");
    transactionTableBody.innerHTML = "";

    if (!transactions || transactions.length === 0) {
        transactionTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-transactions">No transactions found</td>
            </tr>
        `;
        return;
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tx.stockSymbol}</td>
            <td>${tx.companyName}</td>
            <td class="${tx.transactionType.toLowerCase()}">${tx.transactionType}</td>
            <td>${tx.quantity}</td>
            <td>₹${formatNumber(tx.price)}</td>
            <td>₹${formatNumber(tx.totalAmount)}</td>
            <td>${new Date(tx.date).toLocaleString()}</td>
        `;
        transactionTableBody.appendChild(row);
    });
}

// Fetch and display portfolio
async function fetchPortfolio() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found!");
        return;
    }

    try {
        const response = await fetch(`${ACCOUNT_API_URL}/${userId}/portfolio`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        updatePortfolioUI(data);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        showNotification("Failed to load portfolio", "error");
    }
}

// Update portfolio UI
function updatePortfolioUI(data) {
    const portfolioTableBody = document.getElementById("portfolio-list");
    portfolioTableBody.innerHTML = "";

    if (!data.holdings || data.holdings.length === 0) {
        portfolioTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-holdings">No holdings found</td>
            </tr>
        `;
        return;
    }

    data.holdings.forEach(holding => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${holding.stockSymbol}</td>
            <td>${holding.companyName}</td>
            <td>${holding.quantity}</td>
            <td>₹${formatNumber(holding.avgPrice)}</td>
            <td>₹${formatNumber(holding.currentPrice)}</td>
            <td class="${holding.profitLoss >= 0 ? 'profit' : 'loss'}">
                ₹${formatNumber(Math.abs(holding.profitLoss))} (${holding.profitLossPercent.toFixed(2)}%)
            </td>
        `;
        portfolioTableBody.appendChild(row);
    });
}

// Helper function to format numbers
function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Show notification
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add("fade-out");
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    initializeUserData();
    loadStockSymbols();
    fetchAccountSummary();
    fetchTransactions();
    fetchPortfolio();
    
    // Event listeners
    document.getElementById("stock-symbol").addEventListener("input", searchStocks);
    document.getElementById("place-order").addEventListener("click", placeOrder);
    
    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#stock-symbol") && !e.target.closest("#suggestions")) {
            document.getElementById("suggestions").style.display = "none";
        }
    });
});
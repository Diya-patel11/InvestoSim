document.addEventListener("DOMContentLoaded", function () {
    updatePortfolio();
    setTimeout(setupPortfolioChart, 500); // Delay to ensure Chart.js loads
});

// Update Portfolio Data
function updatePortfolio() {
    let accountValue = parseFloat(localStorage.getItem("portfolioValue") || 5000);
    let availableCash = parseFloat(localStorage.getItem("availableCash") || 5000);
    let totalInvestments = parseFloat(localStorage.getItem("totalInvestments") || 0);

    let todayChange = ((Math.random() - 0.5) * 2).toFixed(2);
    let annualReturn = ((totalInvestments - 5000) / 5000 * 100).toFixed(2);

    document.getElementById("accountValue").textContent = `$${(accountValue + availableCash).toFixed(2)}`;
    document.getElementById("todaysChange").textContent = `${todayChange}%`;
    document.getElementById("todaysChange").className = todayChange >= 0 ? "positive" : "negative";
    document.getElementById("annualReturn").textContent = `${annualReturn}%`;
}

// Fix: Make sure Chart.js is initialized properly
let portfolioChart;
function setupPortfolioChart() {
    let canvas = document.getElementById("portfolioPerformanceChart");

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    let chartContainer = canvas.parentElement;
    chartContainer.style.height = "350px"; // Prevents excessive height

    let ctx = canvas.getContext("2d");

    let today = new Date();
    let labels = generateDateLabels(today, 7); // Default to 1 Week

    portfolioChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Portfolio Value",
                data: generatePortfolioData(5000, labels.length),
                borderColor: "#003366", //line color
                borderWidth: 2,
                pointRadius: 2, // Small dots
                pointHoverRadius: 5, // Bigger dots on hover
                tension: 0.3 // Smooth curve
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: "Time" },
                    ticks: {
                        display: false // Hide X-axis labels for a clean look
                    }
                },
                y: {
                    title: { display: true, text: "Value ($)" }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function (tooltipItems) {
                            return formatDate(tooltipItems[0].label);
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x"
                    },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: "xy"
                    }
                }
            }
        }
    });
}

// Generate Date Labels
function generateDateLabels(startDate, days) {
    let labels = [];
    for (let i = 0; i < days; i++) {
        let date = new Date(startDate);
        date.setDate(date.getDate() - i);
        labels.unshift(date.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }
    return labels;
}

// Generate Portfolio Data
function generatePortfolioData(startValue, length) {
    let data = [];
    for (let i = 0; i < length; i++) {
        data.push((startValue + (Math.random() - 0.5) * 100).toFixed(2));
    }
    return data;
}

// Format Date for Tooltip
function formatDate(dateStr) {
    let date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Update Chart Data Based on Timeframe
function updateChartData(timeframe) {
    if (!portfolioChart) {
        console.error("Chart is not initialized!");
        return;
    }

    let today = new Date();
    let timeframes = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365 };
    let days = timeframes[timeframe] || 30;

    let labels = generateDateLabels(today, days);
    let data = generatePortfolioData(5000, labels.length);

    portfolioChart.data.labels = labels;
    portfolioChart.data.datasets[0].data = data;
    portfolioChart.update();
}
// =================== STOCK SEARCH & DATA ===================
const API_KEY = "XY0PDPZ0MCKBEZ7X"; // Replace with your Alpha Vantage API key
const API_BASE_URL = "https://www.alphavantage.co/query";
let stockList = [];

async function loadStockSymbols() {
    try {
        const response = await fetch("indian_stocks.json");
        stockList = await response.json();
    } catch (error) {
        console.error("Error loading stock symbols:", error);
    }
}

function searchStocks() {
    let query = document.getElementById("stock-symbol").value.trim().toUpperCase();
    let suggestionsDiv = document.getElementById("suggestions");

    if (query.length < 2) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    let results = stockList.filter(stock =>
        stock.name.toUpperCase().includes(query) || stock.symbol.toUpperCase().includes(query)
    ).slice(0, 10);

    suggestionsDiv.innerHTML = results.length === 0
        ? "<div>No results found</div>"
        : results.map(stock => `<div onclick="selectStock('${stock.symbol}', '${stock.name}')">${stock.name} (${stock.symbol})</div>`).join("");
}

function selectStock(symbol, name) {
    document.getElementById("stock-symbol").value = `${name} (${symbol})`;
    document.getElementById("suggestions").innerHTML = "";
    fetchStockData(symbol);
}

async function fetchStockData(symbol) {
    let nseSymbol = `${symbol}.NSE`;
    let bseSymbol = `${symbol}.BSE`;

    try {
        let stockData = await getStockData(nseSymbol);
        if (!stockData) stockData = await getStockData(bseSymbol);
        if (!stockData) {
            alert("Stock data not available.");
            return;
        }

        let stock = stockData["Global Quote"];

        document.getElementById("stock-details").style.display = "block";
        document.getElementById("stock-name").innerText = `Stock: ${symbol}`;
        document.getElementById("stock-price").innerText = `Price: ₹${stock["05. price"]}`;
        document.getElementById("stock-change").innerText = `Change: ${stock["09. change"]} (${stock["10. change percent"]})`;
        document.getElementById("stock-volume").innerText = `Volume: ${stock["06. volume"]}`;

        fetchHistoricalData(nseSymbol);
    } catch (error) {
        console.error("Error fetching stock details:", error);
        alert("Failed to fetch stock details.");
    }
}

async function getStockData(symbol) {
    let response = await fetch(`${API_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    let data = await response.json();
    return data["Global Quote"] && Object.keys(data["Global Quote"]).length ? data : null;
}

async function fetchHistoricalData(symbol) {
    try {
        const response = await fetch(`${API_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();

        if (!data["Time Series (Daily)"]) return;

        let historicalPrices = Object.entries(data["Time Series (Daily)"])
            .map(([date, prices]) => ({ date, close: parseFloat(prices["4. close"]) }))
            .slice(0, 30);

        updateChart(historicalPrices);
    } catch (error) {
        console.error("Error fetching historical stock data:", error);
    }
}

function updateChart(priceData) {
    const ctx = document.getElementById("stock-chart").getContext("2d");

    if (window.stockChart) window.stockChart.destroy();

    window.stockChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: priceData.map(data => data.date),
            datasets: [{
                label: "Stock Price",
                data: priceData.map(data => data.close),
                borderColor: "blue",
                borderWidth: 2,
                fill: false,
                pointRadius: 2,
                tension: 0.2
            }]
        }
    });
}

// ✅ Function to fetch and display transactions for a user
/*async function fetchTransactions() {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    try {
        const response = await fetch(`http://localhost:5001/api/transactions/${userId}`);
        const transactions = await response.json();

        if (!response.ok) throw new Error(transactions.error || "Failed to fetch transactions");

        console.log("Transactions:", transactions);
        displayTransactions(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

// ✅ Function to display transactions in the table
function displayTransactions(transactions) {
    const transactionTableBody = document.getElementById("transaction-list");
    transactionTableBody.innerHTML = ""; // Clear previous data

    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tx.stockSymbol}</td>
            <td>${tx.companyName}</td>
            <td>${tx.transactionType}</td>
            <td>${tx.quantity}</td>
            <td>₹${tx.price.toFixed(2)}</td>
            <td>₹${tx.totalAmount.toFixed(2)}</td>
            <td>${new Date(tx.date).toLocaleString()}</td>
        `;
        transactionTableBody.appendChild(row);
    });
}

// ✅ Fetch portfolio data
async function fetchPortfolio() {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    try {
        const response = await fetch(`http://localhost:5001/api/portfolio/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch portfolio");

        document.getElementById("availableCash").textContent = `₹${data.availableCash.toLocaleString()}`;
        document.getElementById("portfolioValue").textContent = `₹${data.portfolioValue.toLocaleString()}`;

        return data;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

// ✅ Function to handle buying & selling stocks
async function tradeStock(action) {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    let portfolio = await fetchPortfolio();
    if (!portfolio) return;

    let availableCash = parseFloat(portfolio.availableCash);
    let portfolioValue = parseFloat(portfolio.portfolioValue);

    // Fetch real-time stock price (Example: Replace with API)
    let stockPrice = await fetchStockPrice("TCS"); // Example stock

    if (action === "buy") {
        if (availableCash >= stockPrice) {
            availableCash -= stockPrice;
            portfolioValue += stockPrice;
            alert("Stock bought successfully!");
        } else {
            alert("Insufficient funds to buy stock.");
            return;
        }
    } else if (action === "sell") {
        if (portfolioValue >= stockPrice) {
            availableCash += stockPrice;
            portfolioValue -= stockPrice;
            alert("Stock sold successfully!");
        } else {
            alert("You don't own enough stocks to sell.");
            return;
        }
    }

    // ✅ Update MongoDB with new portfolio values
    await updatePortfolio(userId, availableCash, portfolioValue);
}

// ✅ Function to update portfolio in MongoDB
async function updatePortfolio(userId, availableCash, portfolioValue) {
    try {
        const response = await fetch(`http://localhost:5001/api/portfolio/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availableCash, portfolioValue })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to update portfolio");

        // ✅ Update UI
        document.getElementById("availableCash").textContent = `₹${data.availableCash.toLocaleString()}`;
        document.getElementById("portfolioValue").textContent = `₹${data.portfolioValue.toLocaleString()}`;
    } catch (error) {
        console.error("Error updating portfolio:", error);
    }
}

// ✅ Function to fetch real-time stock price (Placeholder)
async function fetchStockPrice(stockSymbol) {
    try {
        // Replace with actual API call to fetch live stock prices
        console.log(`Fetching real-time price for ${stockSymbol}...`);
        return 100; // Mock price ₹100
    } catch (error) {
        console.error("Error fetching stock price:", error);
        return 0; // Fallback to ₹0
    }
}

// ✅ Call fetch functions when page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchTransactions();
    fetchPortfolio();
});
*/

//from here

// Fetch and display transactions for a user
/*async function fetchTransactions() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5001/api/transactions/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const transactions = await response.json();
        console.log("Transactions:", transactions);
        displayTransactions(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Failed to fetch transactions. Please try again.");
    }
}

// Display transactions in the table
function displayTransactions(transactions) {
    const transactionTableBody = document.getElementById("transaction-list");
    transactionTableBody.innerHTML = ""; // Clear previous data

    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tx.stockSymbol}</td>
            <td>${tx.companyName}</td>
            <td>${tx.transactionType}</td>
            <td>${tx.quantity}</td>
            <td>₹${tx.price.toFixed(2)}</td>
            <td>₹${tx.totalAmount.toFixed(2)}</td>
            <td>${new Date(tx.date).toLocaleString()}</td>
        `;
        transactionTableBody.appendChild(row);
    });
}
// Fetch portfolio data
async function fetchPortfolio() {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    try {
        const response = await fetch(`http://localhost:5001/api/portfolio/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch portfolio");

        document.getElementById("availableCash").textContent = `₹${data.availableCash.toLocaleString()}`;
        document.getElementById("portfolioValue").textContent = `₹${data.portfolioValue.toLocaleString()}`;

        return data;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

// Initialize dashboard when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchTransactions();
    fetchPortfolio();
});
*/
//upper wala 


// dashboard.js
/*
// Retrieve userId
const userId = localStorage.getItem("userId");

// Fetch and display transactions for a user
async function fetchTransactions() {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    try {
        const response = await fetch(`http://localhost:5001/api/transactions/${userId}`);
        const transactions = await response.json();

        if (!response.ok) throw new Error(transactions.error || "Failed to fetch transactions");

        console.log("Transactions:", transactions);
        displayTransactions(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

// Display transactions in the table
function displayTransactions(transactions) {
    const transactionTableBody = document.getElementById("transaction-list");
    transactionTableBody.innerHTML = ""; // Clear previous data

    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tx.stockSymbol}</td>
            <td>${tx.companyName}</td>
            <td>${tx.transactionType}</td>
            <td>${tx.quantity}</td>
            <td>₹${tx.price.toFixed(2)}</td>
            <td>₹${tx.totalAmount.toFixed(2)}</td>
            <td>${new Date(tx.date).toLocaleString()}</td>
        `;
        transactionTableBody.appendChild(row);
    });
}

// Fetch portfolio data
async function fetchPortfolio() {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    try {
        const response = await fetch(`http://localhost:5001/api/portfolio/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch portfolio");

        document.getElementById("availableCash").textContent = `₹${data.availableCash.toLocaleString()}`;
        document.getElementById("portfolioValue").textContent = `₹${data.portfolioValue.toLocaleString()}`;

        return data;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

// Initialize dashboard when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchTransactions();
    fetchPortfolio();
});

*/








// dashboard.js

// Fetch and display transactions for a user
/*async function fetchTransactions() {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    try {
        const response = await fetch(`http://localhost:5001/api/transactions/${userId}`);
        const transactions = await response.json();

        if (!response.ok) throw new Error(transactions.error || "Failed to fetch transactions");

        console.log("Transactions:", transactions);
        displayTransactions(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

// Display transactions in the table
function displayTransactions(transactions) {
    const transactionTableBody = document.getElementById("transaction-list");
    transactionTableBody.innerHTML = ""; // Clear previous data

    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tx.stockSymbol}</td>
            <td>${tx.companyName}</td>
            <td>${tx.transactionType}</td>
            <td>${tx.quantity}</td>
            <td>₹${tx.price.toFixed(2)}</td>
            <td>₹${tx.totalAmount.toFixed(2)}</td>
            <td>${new Date(tx.date).toLocaleString()}</td>
        `;
        transactionTableBody.appendChild(row);
    });
}

// Fetch portfolio data
async function fetchPortfolio() {
    const userId = localStorage.getItem("userId") || "67dd532072920d14c707102c"; // Replace with actual user logic
    if (!userId) return console.error("User ID not found!");

    try {
        const response = await fetch(`http://localhost:5001/api/portfolio/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch portfolio");

        document.getElementById("availableCash").textContent = `₹${data.availableCash.toLocaleString()}`;
        document.getElementById("portfolioValue").textContent = `₹${data.portfolioValue.toLocaleString()}`;

        return data;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

// Update portfolio in MongoDB
async function updatePortfolio(userId, availableCash, portfolioValue) {
    try {
        const response = await fetch(`http://localhost:5001/api/portfolio/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availableCash, portfolioValue })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to update portfolio");

        // Update UI
        document.getElementById("availableCash").textContent = `₹${data.availableCash.toLocaleString()}`;
        document.getElementById("portfolioValue").textContent = `₹${data.portfolioValue.toLocaleString()}`;
    } catch (error) {
        console.error("Error updating portfolio:", error);
    }
}

// Initialize dashboard when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchTransactions();
    fetchPortfolio();
});*/

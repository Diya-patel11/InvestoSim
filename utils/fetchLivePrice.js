// utils/fetchLivePrice.js
const axios = require('axios');

const fetchLivePrice = async (symbol) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/stock/price/${symbol}`);
        return response.data.price; // adjust based on your actual API response
    } catch (err) {
        console.error('Error fetching price for', symbol, err.message);
        return 0; // fallback price
    }
};

module.exports = fetchLivePrice;

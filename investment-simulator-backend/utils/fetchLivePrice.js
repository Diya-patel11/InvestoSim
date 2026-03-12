const axios = require('axios');

const fetchLivePrice = async (symbol) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/stock/price/${symbol}`);
        return response.data.price;
    } catch (err) {
        console.error('Error fetching price for', symbol);
        return 0;
    }
};

module.exports = fetchLivePrice;

# from flask import Flask, jsonify
# from flask_cors import CORS
# import yfinance as yf

# app = Flask(__name__)
# CORS(app)

# @app.route("/stock/<symbol>", methods=["GET"])
# def get_stock_data(symbol):
#     try:
#         stock = yf.Ticker(symbol + ".NS")  # NSE suffix
#         info = stock.info

#         data = stock.history(period="1d", interval="1m")
#         if data.empty:
#             return jsonify({"error": "No data found"}), 404

#         latest = data.iloc[-1]
#         response = {
#             "symbol": symbol.upper(),
#             "current_price": round(latest["Close"], 2),
#             "open": round(latest["Open"], 2),
#             "high": round(latest["High"], 2),
#             "low": round(latest["Low"], 2),
#             "volume": int(latest["Volume"]),
#             "company_name": info.get("longName", "N/A"),
#             "sector": info.get("sector", "N/A"),
#             "industry": info.get("industry", "N/A"),
#             "website": info.get("website", "N/A"),
#             "summary": info.get("longBusinessSummary", "N/A"),
#         }
#         return jsonify(response)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(port=5003, debug=True)
from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route("/stock/<symbol>", methods=["GET"])
def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol + ".NS")  # NSE suffix
        info = stock.info

        # Get latest price data
        data = stock.history(period="1d", interval="1m")
        if data.empty:
            return jsonify({"error": "No data found"}), 404

        latest = data.iloc[-1]
        
        # Get previous close
        prev_data = stock.history(period="2d", interval="1d")
        previous_close = prev_data.iloc[0]["Close"] if len(prev_data) > 1 else latest["Close"]

        response = {
            "symbol": symbol.upper(),
            "current_price": round(latest["Close"], 2),
            "open": round(latest["Open"], 2),
            "high": round(latest["High"], 2),
            "low": round(latest["Low"], 2),
            "volume": int(latest["Volume"]),
            "previous_close": round(previous_close, 2),
            "company_name": info.get("longName", "N/A"),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "website": info.get("website", "N/A"),
            "summary": info.get("longBusinessSummary", "N/A"),
            "market_cap": info.get("marketCap", 0),
            "fifty_two_week_high": info.get("fiftyTwoWeekHigh", 0),
            "fifty_two_week_low": info.get("fiftyTwoWeekLow", 0),
            "earnings_per_share": info.get("trailingEps", 0)
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history/<symbol>", methods=["GET"])
def get_history_data(symbol):
    try:
        stock = yf.Ticker(symbol + ".NS")
        
        # Get 1 month of historical data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        hist = stock.history(start=start_date, end=end_date)
        
        if hist.empty:
            return jsonify({"error": "No historical data found"}), 404
            
        # Format dates and close prices for chart
        dates = [date.strftime('%Y-%m-%d') for date in hist.index]
        close_prices = [round(price, 2) for price in hist['Close'].tolist()]
        
        return jsonify({
            "symbol": symbol.upper(),
            "dates": dates,
            "close_prices": close_prices
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/news/<symbol>", methods=["GET"])
def get_news(symbol):
    try:
        stock = yf.Ticker(symbol + ".NS")
        news = stock.news
        
        formatted_news = []
        for item in news[:5]:  # Limit to 5 news items
            formatted_news.append({
                "title": item.get("title", ""),
                "publisher": item.get("publisher", ""),
                "link": item.get("link", ""),
                "publishedAt": item.get("providerPublishTime", ""),
                "description": item.get("description", "")
            })
            
        return jsonify({"news": formatted_news})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5003, debug=True)
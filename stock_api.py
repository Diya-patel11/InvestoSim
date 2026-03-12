# from flask import Flask, jsonify, request
# import yfinance as yf
# from flask import Flask

# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/stock/<symbol>', methods=['GET'])
# def get_stock_data(symbol):
#     try:
#         original_symbol = symbol
#         exchange = "NSE"

#         if symbol.startswith("NSE:"):
#             symbol = symbol[4:]
#         elif symbol.endswith(".NS"):
#             symbol = symbol.replace(".NS", "")
#         elif symbol.endswith(".BO"):
#             symbol = symbol.replace(".BO", "")
#             exchange = "BSE"

#         yf_symbol = f"{symbol}.NS" if exchange == "NSE" else f"{symbol}.BO"
#         print(f"🔍 Requesting: {yf_symbol}")

#         # Get the last day’s price
#         ticker = yf.Ticker(yf_symbol)
#         hist = ticker.history(period="1d")

#         if hist.empty:
#             return jsonify({
#                 "error": f"No historical data found for {yf_symbol}"
#             }), 404

#         latest = hist.iloc[-1]  # Last available row

#         response = {
#             "symbol": symbol.upper(),
#             "name": yf_symbol,  # Optional: replace with static names if needed
#             "price": float(latest["Close"]),
#             "change": float(latest["Close"] - latest["Open"]),
#             "changePercent": round(((latest["Close"] - latest["Open"]) / latest["Open"]) * 100, 2),
#             "volume": int(latest["Volume"]),
#             "exchange": exchange
#         }

#         return jsonify(response)

#     except Exception as e:
#         print(f"❌ Crash for symbol {symbol}: {e}")
#         return jsonify({
#             "error": "Internal server error",
#             "details": str(e)
#         }), 500

# if __name__ == '__main__':
#     app.run(port=5002)
from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
import time

app = Flask(__name__)
CORS(app)

# Simple cache to prevent repeated Yahoo Finance requests
cache = {}
CACHE_TIMEOUT = 60  # seconds

@app.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        exchange = "NSE"

        if symbol.startswith("NSE:"):
            symbol = symbol[4:]
        elif symbol.endswith(".NS"):
            symbol = symbol.replace(".NS", "")
        elif symbol.endswith(".BO"):
            symbol = symbol.replace(".BO", "")
            exchange = "BSE"

        yf_symbol = f"{symbol}.NS" if exchange == "NSE" else f"{symbol}.BO"
        print(f"🔍 Requesting: {yf_symbol}")

        # Cache key
        cache_key = yf_symbol.lower()
        now = time.time()

        # Check if cached and not expired
        if cache_key in cache:
            cached_time, cached_data = cache[cache_key]
            if now - cached_time < CACHE_TIMEOUT:
                print("✅ Serving from cache")
                return jsonify(cached_data)

        # Fetch fresh data
        ticker = yf.Ticker(yf_symbol)
        hist = ticker.history(period="1d")

        if hist.empty:
            return jsonify({"error": f"No historical data found for {yf_symbol}"}), 404

        latest = hist.iloc[-1]

        response = {
            "symbol": symbol.upper(),
            "name": yf_symbol,
            "price": float(latest["Close"]),
            "change": float(latest["Close"] - latest["Open"]),
            "changePercent": round(((latest["Close"] - latest["Open"]) / latest["Open"]) * 100, 2),
            "volume": int(latest["Volume"]),
            "exchange": exchange
        }

        # Cache it
        cache[cache_key] = (now, response)
        return jsonify(response)

    except Exception as e:
        print(f"❌ Crash for symbol {symbol}: {e}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5002)

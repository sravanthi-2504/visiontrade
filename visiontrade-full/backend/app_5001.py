from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
import feedparser
from datetime import datetime, timedelta
import threading
import time

app = Flask(__name__)
CORS(app)


market_data_cache = {
    'data': None,
    'timestamp': None,
    'expires_in': 60
}

def fetch_news():
    try:
        feed = feedparser.parse("https://finance.yahoo.com/rss/topstories")
        return [{"title": n.title, "link": n.link} for n in feed.entries[:5]]
    except:
        return []

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "time": datetime.now().isoformat()})

@app.route('/api/market-data')
def market_data():
    return jsonify({
        "status": "success",
        "marketStatus": "OPEN",
        "indices": [
            {"name": "NIFTY 50", "value": 22045.50, "change": 1.23},
            {"name": "SENSEX", "value": 72650.75, "change": 0.89},
            {"name": "NIFTY BANK", "value": 48560.25, "change": 1.56}
        ],
        "topGainers": [
            {"symbol": "TCS", "price": 3890.50, "change_pct": 3.2},
            {"symbol": "INFY", "price": 1650.75, "change_pct": 2.1},
            {"symbol": "RELIANCE", "price": 2850.25, "change_pct": 1.8}
        ],
        "marketNews": fetch_news(),
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/stock/<symbol>')
def stock_data(symbol):
    try:
        original_symbol = symbol.upper()

        # Add NSE suffix if missing
        if not original_symbol.endswith('.NS'):
            yf_symbol = original_symbol + '.NS'
        else:
            yf_symbol = original_symbol

        # Use safer period
        data = yf.download(
            yf_symbol,
            period="1mo",   # safer than 7d
            interval="1d",
            progress=False
        )

        if data.empty or 'Close' not in data.columns:
            return jsonify({
                "status": "error",
                "message": f"No data found for {original_symbol}"
            }), 404

        closes = data['Close'].dropna()

        if len(closes) == 0:
            return jsonify({
                "status": "error",
                "message": "No closing price data"
            }), 404

        current = float(closes.iloc[-1])
        previous = float(closes.iloc[-2]) if len(closes) > 1 else current

        change = current - previous
        change_percent = (change / previous * 100) if previous != 0 else 0

        return jsonify({
            "status": "success",
            "symbol": original_symbol,
            "currentPrice": round(current, 2),
            "change": round(change, 2),
            "changePercent": round(change_percent, 2),
            "prediction": round(current * 1.05, 2)
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/index/<symbol>')
def index_data(symbol):
    try:
        ticker = yf.Ticker(f"{symbol}.NS")
        data = ticker.history(period="1d", interval="5m")

        if data.empty:
            return jsonify({"status": "error", "message": "No data"}), 404

        current = float(data["Close"].iloc[-1])
        previous = float(data["Close"].iloc[0])

        change = current - previous
        change_percent = (change / previous) * 100

        return jsonify({
            "status": "success",
            "symbol": symbol,
            "current": round(current, 2),
            "change": round(change, 2),
            "changePercent": round(change_percent, 2),
            "chart": {
                "labels": [str(i) for i in data.index],
                "values": data["Close"].round(2).tolist()
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    print("🚀 Starting VisionTrade API on http://localhost:5001")
    print("📊 Endpoints:")
    print("   http://localhost:5001/api/health")
    print("   http://localhost:5001/api/market-data")
    print("   http://localhost:5001/api/stock/TCS")
    app.run(host='0.0.0.0', port=5001, debug=True)

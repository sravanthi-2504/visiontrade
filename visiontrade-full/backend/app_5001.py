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
        if not symbol.endswith('.NS'):
            symbol += '.NS'
        
        data = yf.download(symbol, period="7d", progress=False)
        
        if data.empty:
            return jsonify({"error": "Stock not found"}), 404
        
        prices = data['Close'].astype(float).tolist()
        
        return jsonify({
            "symbol": symbol.replace(".NS", ""),
            "currentPrice": round(prices[-1], 2),
            "change": round(prices[-1] - prices[-2], 2) if len(prices) > 1 else 0,
            "prediction": round(prices[-1] * 1.05, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting VisionTrade API on http://localhost:5001")
    print("📊 Endpoints:")
    print("   http://localhost:5001/api/health")
    print("   http://localhost:5001/api/market-data")
    print("   http://localhost:5001/api/stock/TCS")
    app.run(host='0.0.0.0', port=5001, debug=True)

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

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "time": datetime.now().isoformat()})

@app.route('/api/market-data')
def market_data():
    return jsonify({
        "marketStatus": "OPEN",
        "indices": [
            {"name": "NIFTY 50", "value": 22045.50, "change": 1.23},
            {"name": "SENSEX", "value": 72650.75, "change": 0.89}
        ],
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5001, debug=True)

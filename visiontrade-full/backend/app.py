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
CORS(app)  # Enable CORS for React frontend

print("=" * 60)
print("🚀 VISIONTRADE STOCK MARKET API")
print("=" * 60)

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>VisionTrade API</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
            code { background: #2c3e50; color: white; padding: 2px 6px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📈 VisionTrade Stock Market API</h1>
            <p>Welcome to the VisionTrade API server. Available endpoints:</p>
            
            <div class="endpoint">
                <strong><code>GET /api/health</code></strong>
                <p>Health check endpoint</p>
                <a href="/api/health">Test it now</a>
            </div>
            
            <div class="endpoint">
                <strong><code>GET /api/market-data</code></strong>
                <p>Get all market data (indices, gainers, losers, news)</p>
                <a href="/api/market-data">Test it now</a>
            </div>
            
            <div class="endpoint">
                <strong><code>GET /api/stock/&lt;symbol&gt;</code></strong>
                <p>Get specific stock data (e.g., /api/stock/TCS)</p>
                <a href="/api/stock/TCS">Test TCS</a> | 
                <a href="/api/stock/INFY">Test INFY</a>
            </div>
            
            <div class="endpoint">
                <strong><code>GET /api/search/&lt;query&gt;</code></strong>
                <p>Search for stocks</p>
                <a href="/api/search/TCS">Search "TCS"</a>
            </div>
            
            <hr>
            <p><strong>API Status:</strong> <span style="color: green;">● Running</span></p>
            <p><strong>Timestamp:</strong> ''' + datetime.now().isoformat() + '''</p>
        </div>
    </body>
    </html>
    '''


@app.route('/api/health')
def health():
    return jsonify({
        "status": "healthy",
        "service": "visiontrade-api",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "endpoints": [
            "/api/health",
            "/api/market-data",
            "/api/stock/<symbol>",
            "/api/search/<query>"
        ]
    })


@app.route('/api/market-data')
def market_data():
    """Get all market data"""
    try:
        # Mock data for quick testing
        return jsonify({
            "status": "success",
            "marketStatus": "OPEN",
            "indices": [
                {"name": "NIFTY 50", "value": 22045.50, "change": 1.23},
                {"name": "SENSEX", "value": 72650.75, "change": 0.89},
                {"name": "NIFTY BANK", "value": 48560.25, "change": 1.56}
            ],
            "topGainers": [
                {"symbol": "TCS", "name": "Tata Consultancy", "price": 3890.50, "change": 2.45, "change_pct": 3.2},
                {"symbol": "INFY", "name": "Infosys", "price": 1650.75, "change": 32.50, "change_pct": 2.1},
                {"symbol": "RELIANCE", "name": "Reliance", "price": 2850.25, "change": 45.30, "change_pct": 1.8}
            ],
            "topLosers": [
                {"symbol": "ITC", "name": "ITC Ltd", "price": 425.60, "change": -8.75, "change_pct": -2.1},
                {"symbol": "SBIN", "name": "SBI", "price": 620.40, "change": -12.30, "change_pct": -1.9},
                {"symbol": "ICICIBANK", "name": "ICICI Bank", "price": 1050.80, "change": -18.40, "change_pct": -1.7}
            ],
            "mostActive": [
                {"symbol": "TCS", "name": "Tata Consultancy", "volume": "2.5M", "price": 3890.50, "change_pct": 3.2},
                {"symbol": "RELIANCE", "name": "Reliance", "volume": "1.8M", "price": 2850.25, "change_pct": 1.8},
                {"symbol": "INFY", "name": "Infosys", "volume": "1.5M", "price": 1650.75, "change_pct": 2.1}
            ],
            "marketNews": [
                {"title": "Stock markets hit record highs", "source": "Economic Times", "time": "2 hours ago"},
                {"title": "RBI keeps repo rate unchanged", "source": "Business Standard", "time": "4 hours ago"},
                {"title": "IT sector leads market rally", "source": "Moneycontrol", "time": "6 hours ago"}
            ],
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/stock/<symbol>')
def stock_data(symbol):
    """Get data for specific stock"""
    try:
        # Simple mock data
        prices = {
            "TCS": 3890.50,
            "INFY": 1650.75,
            "RELIANCE": 2850.25,
            "SBIN": 620.40,
            "ITC": 425.60,
            "ICICIBANK": 1050.80
        }
        
        price = prices.get(symbol.upper(), 1000.00)
        
        return jsonify({
            "status": "success",
            "symbol": symbol.upper(),
            "currentPrice": price,
            "change": round(price * 0.02, 2),  # Mock 2% change
            "changePercent": 2.0,
            "prediction": {
                "predictedPrice": round(price * 1.05, 2),
                "confidence": 78.5,
                "recommendation": "BUY",
                "target": round(price * 1.10, 2)
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/search/<query>')
def search_stocks(query):
    """Search for stocks"""
    stocks = [
        {"symbol": "TCS", "name": "Tata Consultancy Services", "exchange": "NSE"},
        {"symbol": "INFY", "name": "Infosys", "exchange": "NSE"},
        {"symbol": "RELIANCE", "name": "Reliance Industries", "exchange": "NSE"},
        {"symbol": "HDFCBANK", "name": "HDFC Bank", "exchange": "NSE"},
        {"symbol": "ICICIBANK", "name": "ICICI Bank", "exchange": "NSE"},
        {"symbol": "SBIN", "name": "State Bank of India", "exchange": "NSE"},
        {"symbol": "AAPL", "name": "Apple Inc", "exchange": "NASDAQ"},
        {"symbol": "GOOGL", "name": "Alphabet Inc", "exchange": "NASDAQ"},
        {"symbol": "MSFT", "name": "Microsoft", "exchange": "NASDAQ"}
    ]
    
    query = query.upper()
    results = [s for s in stocks if query in s["symbol"] or query in s["name"].upper()]
    
    return jsonify({
        "status": "success",
        "query": query,
        "results": results,
        "count": len(results)
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "available_endpoints": [
            "/",
            "/api/health",
            "/api/market-data",
            "/api/stock/<symbol>",
            "/api/search/<query>"
        ]
    }), 404

if __name__ == '__main__':
    print("📡 Available endpoints:")
    print("   🌐 http://localhost:5001/")
    print("   ❤️  http://localhost:5001/api/health")
    print("   📊 http://localhost:5001/api/market-data")
    print("   📈 http://localhost:5001/api/stock/TCS")
    print("   🔍 http://localhost:5001/api/search/TCS")
    print("=" * 60)
    print("💡 Tip: Keep this terminal open while using the API")
    print("=" * 60)
    
    # Try different ports if 5001 is busy
    ports = [5001, 5002, 5003, 8000, 8080]
    for port in ports:
        try:
            print(f"\n🔧 Trying port {port}...")
            app.run(host='0.0.0.0', port=port, debug=True)
            break
        except OSError as e:
            if "Address already in use" in str(e):
                print(f"   Port {port} is busy, trying next...")
                continue
            else:
                raise e

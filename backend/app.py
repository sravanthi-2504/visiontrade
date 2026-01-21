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

# Cache for market data
market_data_cache = {
    'data': None,
    'timestamp': None,
    'expires_in': 60  # Cache for 60 seconds
}

# -------- Helper Functions --------
def fetch_news():
    """Fetch market news from RSS feed"""
    try:
        feed = feedparser.parse("https://finance.yahoo.com/rss/topstories")
        news_items = []
        for n in feed.entries[:8]:
            news_items.append({
                "title": n.title,
                "link": n.link,
                "source": "Yahoo Finance",
                "time": "Just now"
            })
        return news_items
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def fetch_stock_data(symbol):
    """Get stock data for a symbol"""
    try:
        # Add .NS for Indian stocks if not present
        if not symbol.endswith('.NS') and not '.' in symbol:
            symbol += '.NS'

        data = yf.download(symbol, period="1mo", progress=False)

        if data.empty:
            return {"dates": [], "prices": [], "current": 0}

        if isinstance(data.columns, pd.MultiIndex):
            data = data.xs(symbol, level=1, axis=1)

        dates = data.index.strftime('%Y-%m-%d').tolist()
        prices = data['Close'].astype(float).tolist() if 'Close' in data.columns else []

        current_price = round(float(prices[-1]), 2) if prices else 0
        prev_price = round(float(prices[-2]), 2) if len(prices) > 1 else current_price
        change = current_price - prev_price
        change_pct = (change / prev_price * 100) if prev_price != 0 else 0

        return {
            "dates": dates[-30:],  # Last 30 days
            "prices": prices[-30:],
            "current": current_price,
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "volume": int(data['Volume'].iloc[-1]) if 'Volume' in data.columns else 0
        }
    except Exception as e:
        print(f"Error fetching stock data for {symbol}: {e}")
        return {"dates": [], "prices": [], "current": 0, "change": 0, "change_pct": 0, "volume": 0}

def fetch_market_tables():
    """Get top gainers, losers, and most active stocks"""
    indian_stocks = [
        "TCS.NS", "INFY.NS", "RELIANCE.NS", "ICICIBANK.NS",
        "HDFCBANK.NS", "SBIN.NS", "ITC.NS", "HCLTECH.NS",
        "WIPRO.NS", "TATAMOTORS.NS", "BHARTIARTL.NS", "LT.NS"
    ]

    data = []

    for symbol in indian_stocks:
        try:
            stock_data = fetch_stock_data(symbol)
            if stock_data["current"] > 0:
                data.append({
                    "symbol": symbol.replace(".NS", ""),
                    "name": get_company_name(symbol),
                    "price": stock_data["current"],
                    "change": stock_data["change"],
                    "change_pct": stock_data["change_pct"],
                    "volume": stock_data["volume"]
                })
        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            continue

    # Sort and categorize
    if data:
        gainers = sorted(data, key=lambda x: x['change_pct'], reverse=True)[:6]
        losers = sorted(data, key=lambda x: x['change_pct'])[:6]
        active = sorted(data, key=lambda x: x['volume'], reverse=True)[:6]
        return gainers, losers, active

    return [], [], []

def get_company_name(symbol):
    """Get company name from symbol"""
    names = {
        "TCS.NS": "Tata Consultancy Services",
        "INFY.NS": "Infosys",
        "RELIANCE.NS": "Reliance Industries",
        "ICICIBANK.NS": "ICICI Bank",
        "HDFCBANK.NS": "HDFC Bank",
        "SBIN.NS": "State Bank of India",
        "ITC.NS": "ITC Limited",
        "HCLTECH.NS": "HCL Technologies",
        "WIPRO.NS": "Wipro",
        "TATAMOTORS.NS": "Tata Motors",
        "BHARTIARTL.NS": "Bharti Airtel",
        "LT.NS": "Larsen & Toubro"
    }
    return names.get(symbol, symbol.replace(".NS", ""))

def fetch_indices():
    """Get market indices data"""
    indices = [
        {"name": "NIFTY 50", "symbol": "^NSEI", "value": 0, "change": 0},
        {"name": "SENSEX", "symbol": "^BSESN", "value": 0, "change": 0},
        {"name": "NIFTY BANK", "symbol": "^NSEBANK", "value": 0, "change": 0},
        {"name": "NIFTY IT", "symbol": "^CNXIT", "value": 0, "change": 0}
    ]

    for idx in indices:
        try:
            data = yf.download(idx["symbol"], period="2d", progress=False)
            if not data.empty and len(data) > 0:
                current = float(data['Close'].iloc[-1])
                prev = float(data['Close'].iloc[-2]) if len(data) > 1 else current
                idx["value"] = round(current, 2)
                idx["change"] = round(((current - prev) / prev) * 100, 2)
        except Exception as e:
            print(f"Error fetching index {idx['name']}: {e}")
            continue

    return indices

def calculate_technical_indicators():
    """Calculate technical indicators (mock for now)"""
    return {
        "RSI": round(60 + np.random.random() * 20, 1),
        "MACD": "Bullish" if np.random.random() > 0.4 else "Bearish",
        "SMA_50": round(18000 + np.random.random() * 1000, 2),
        "SMA_200": round(17500 + np.random.random() * 1000, 2),
        "support": round(17800 + np.random.random() * 200, 2),
        "resistance": round(18500 + np.random.random() * 200, 2),
        "prediction": "UP" if np.random.random() > 0.3 else "DOWN",
        "confidence": round(70 + np.random.random() * 20, 1),
        "volatility": round(np.random.random() * 5, 2)
    }

def generate_fii_dii_data():
    """Generate FII/DII data (mock)"""
    dates = []
    for i in range(6, 0, -1):
        date = datetime.now() - timedelta(days=i)
        dates.append(date.strftime('%b %d'))

    return [
        {"date": dates[0], "FII": 1250, "DII": -850},
        {"date": dates[1], "FII": -980, "DII": 1420},
        {"date": dates[2], "FII": 2100, "DII": 680},
        {"date": dates[3], "FII": -1560, "DII": 2340},
        {"date": dates[4], "FII": 1890, "DII": -450},
        {"date": dates[5], "FII": 2340, "DII": 1120}
    ]

def update_cache():
    """Update cache in background"""
    while True:
        try:
            print("Updating market data cache...")
            gainers, losers, active = fetch_market_tables()
            news = fetch_news()
            indices = fetch_indices()
            technical = calculate_technical_indicators()
            fii_dii = generate_fii_dii_data()

            market_data_cache['data'] = {
                "marketStatus": "OPEN",
                "indices": indices,
                "topGainers": gainers,
                "topLosers": losers,
                "mostActive": active,
                "marketNews": news,
                "technicalIndicators": technical,
                "fiiDiiData": fii_dii,
                "timestamp": datetime.now().isoformat()
            }
            market_data_cache['timestamp'] = datetime.now()

            print("Cache updated successfully")
        except Exception as e:
            print(f"Error updating cache: {e}")

        # Update every 60 seconds
        time.sleep(60)

# Start background cache update thread
cache_thread = threading.Thread(target=update_cache, daemon=True)
cache_thread.start()

# -------- API Endpoints --------
@app.route('/')
def index():
    return jsonify({
        "message": "VisionTrade Stock Market API",
        "version": "1.0.0",
        "endpoints": {
            "/api/health": "Check API health",
            "/api/market-data": "Get all market data",
            "/api/stock/<symbol>": "Get specific stock data",
            "/api/search/<query>": "Search for stocks",
            "/api/predict": "Predict stock price (POST)"
        }
    })

@app.route('/api/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "cache_age": (datetime.now() - market_data_cache['timestamp']).seconds if market_data_cache['timestamp'] else None
    })

@app.route('/api/market-data')
def market_data():
    """Get all market data in one endpoint"""
    try:
        # Return cached data if available and fresh
        if (market_data_cache['data'] and market_data_cache['timestamp'] and
            (datetime.now() - market_data_cache['timestamp']).seconds < market_data_cache['expires_in']):
            return jsonify({
                "status": "success",
                "data": market_data_cache['data'],
                "source": "cache"
            })

        # Otherwise fetch fresh data
        gainers, losers, active = fetch_market_tables()
        news = fetch_news()
        indices = fetch_indices()
        technical = calculate_technical_indicators()
        fii_dii = generate_fii_dii_data()

        data = {
            "marketStatus": "OPEN",
            "indices": indices,
            "topGainers": gainers,
            "topLosers": losers,
            "mostActive": active,
            "marketNews": news,
            "technicalIndicators": technical,
            "fiiDiiData": fii_dii,
            "timestamp": datetime.now().isoformat()
        }

        # Update cache
        market_data_cache['data'] = data
        market_data_cache['timestamp'] = datetime.now()

        return jsonify({
            "status": "success",
            "data": data,
            "source": "live"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/stock/<symbol>')
def stock_data(symbol):
    """Get data for specific stock"""
    try:
        stock_info = fetch_stock_data(symbol)

        if stock_info["current"] == 0:
            return jsonify({
                "status": "error",
                "message": f"Stock {symbol} not found or data unavailable"
            }), 404

        # Generate prediction
        prediction = {
            "predictedPrice": round(stock_info["current"] * (1 + np.random.uniform(-0.05, 0.08)), 2),
            "confidence": round(70 + np.random.random() * 20, 1),
            "recommendation": "BUY" if stock_info["change_pct"] > 0 or np.random.random() > 0.5 else "SELL",
            "target": round(stock_info["current"] * (1 + np.random.uniform(0.02, 0.12)), 2),
            "stopLoss": round(stock_info["current"] * (1 - np.random.uniform(0.03, 0.08)), 2)
        }

        return jsonify({
            "status": "success",
            "symbol": symbol.replace(".NS", ""),
            "companyName": get_company_name(symbol),
            "currentPrice": stock_info["current"],
            "change": stock_info["change"],
            "changePercent": stock_info["change_pct"],
            "volume": stock_info["volume"],
            "chartData": {
                "dates": stock_info["dates"],
                "prices": stock_info["prices"]
            },
            "prediction": prediction,
            "technicalIndicators": calculate_technical_indicators()
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/search/<query>')
def search_stocks(query):
    """Search for stocks"""
    try:
        # List of available stocks
        available_stocks = [
            {"symbol": "TCS", "name": "Tata Consultancy Services", "exchange": "NSE"},
            {"symbol": "INFY", "name": "Infosys", "exchange": "NSE"},
            {"symbol": "RELIANCE", "name": "Reliance Industries", "exchange": "NSE"},
            {"symbol": "ICICIBANK", "name": "ICICI Bank", "exchange": "NSE"},
            {"symbol": "HDFCBANK", "name": "HDFC Bank", "exchange": "NSE"},
            {"symbol": "SBIN", "name": "State Bank of India", "exchange": "NSE"},
            {"symbol": "AAPL", "name": "Apple Inc", "exchange": "NASDAQ"},
            {"symbol": "GOOGL", "name": "Alphabet Inc", "exchange": "NASDAQ"},
            {"symbol": "MSFT", "name": "Microsoft", "exchange": "NASDAQ"},
            {"symbol": "TSLA", "name": "Tesla Inc", "exchange": "NASDAQ"}
        ]

        # Filter based on query
        query = query.upper()
        results = [
            stock for stock in available_stocks
            if query in stock["symbol"] or query in stock["name"].upper()
        ]

        return jsonify({
            "status": "success",
            "query": query,
            "results": results[:10]  # Limit to 10 results
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict stock price"""
    try:
        data = request.json
        if not data or 'symbol' not in data:
            return jsonify({"status": "error", "message": "Symbol required"}), 400

        symbol = data['symbol']
        stock_info = fetch_stock_data(symbol)

        if stock_info["current"] == 0:
            return jsonify({
                "status": "error",
                "message": f"Cannot predict for {symbol}, data unavailable"
            }), 404

        # Simple prediction algorithm (mock - replace with real ML model)
        current_price = stock_info["current"]
        volatility = np.random.uniform(0.01, 0.05)

        # Simulate prediction with some randomness
        prediction = {
            "symbol": symbol.replace(".NS", ""),
            "currentPrice": current_price,
            "predictedPrice": round(current_price * (1 + np.random.uniform(-0.03, 0.06)), 2),
            "confidence": round(65 + np.random.random() * 25, 1),
            "recommendation": "BUY" if np.random.random() > 0.4 else "HOLD" if np.random.random() > 0.3 else "SELL",
            "timeframe": "1 week",
            "target": round(current_price * (1 + np.random.uniform(0.02, 0.1)), 2),
            "stopLoss": round(current_price * (1 - np.random.uniform(0.03, 0.07)), 2),
            "riskLevel": "Medium" if volatility < 0.03 else "High",
            "volatility": round(volatility * 100, 2)
        }

        return jsonify({
            "status": "success",
            "prediction": prediction,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/sector-performance')
def sector_performance():
    """Get sector performance data"""
    sectors = [
        {"name": "Technology", "value": 8.5, "change": 2.3},
        {"name": "Healthcare", "value": 3.2, "change": 1.1},
        {"name": "Finance", "value": -2.1, "change": -0.8},
        {"name": "Energy", "value": -4.3, "change": -1.5},
        {"name": "Consumer", "value": 2.8, "change": 0.9},
        {"name": "Industrial", "value": 1.5, "change": 0.4}
    ]

    return jsonify({
        "status": "success",
        "sectors": sectors,
        "timestamp": datetime.now().isoformat()
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "available_endpoints": ["/api/health", "/api/market-data", "/api/stock/<symbol>", "/api/predict"]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "status": "error",
        "message": "Internal server error",
        "timestamp": datetime.now().isoformat()
    }), 500

if __name__ == '__main__':
    print("Starting VisionTrade Stock Market API...")
    print("Available endpoints:")
    print("  http://localhost:5000/")
    print("  http://localhost:5000/api/health")
    print("  http://localhost:5000/api/market-data")
    print("  http://localhost:5000/api/stock/TCS")
    print("\nStarting server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5001, debug=True)
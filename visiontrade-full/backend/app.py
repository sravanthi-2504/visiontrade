"""
Vision Trade Backend — app.py
Run: pip install flask flask-cors yfinance && python app.py
Serves on http://127.0.0.1:5001
"""

from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import pytz
import traceback
import threading
import time

app = Flask(__name__)
CORS(app)  # Allow all origins (needed for browser fetch)

# ── Cache to avoid hammering Yahoo Finance ──────────────────────────
_cache = {}
_cache_lock = threading.Lock()
CACHE_TTL = 60  # seconds

def cached(key, fetch_fn):
    with _cache_lock:
        entry = _cache.get(key)
        if entry and (time.time() - entry["ts"]) < CACHE_TTL:
            return entry["data"]
    data = fetch_fn()
    with _cache_lock:
        _cache[key] = {"data": data, "ts": time.time()}
    return data

# ── NSE symbol → Yahoo Finance ticker ──────────────────────────────
# For NSE stocks append ".NS", for BSE append ".BO"
# Indices: ^NSEI (Nifty50), ^BSESN (Sensex), ^CRSLDX (Nifty500)

NSE_SYMBOLS = [
    "RELIANCE","TCS","HDFCBANK","INFY","ICICIBANK","HINDUNILVR","ITC","SBIN",
    "BHARTIARTL","KOTAKBANK","LT","AXISBANK","BAJFINANCE","ASIANPAINT","MARUTI",
    "TITAN","SUNPHARMA","ULTRACEMCO","NESTLEIND","BAJAJFINSV","WIPRO","M&M",
    "HCLTECH","TATAMOTORS","TATASTEEL","ONGC","NTPC","POWERGRID","JSWSTEEL",
    "INDUSINDBK","TECHM","HINDALCO","COALINDIA","ADANIENT","ADANIPORTS",
    "HEROMOTOCO","DIVISLAB","DRREDDY","CIPLA","BRITANNIA","EICHERMOT","GRASIM",
    "SHREECEM","APOLLOHOSP","TATACONSUM","VEDL","BPCL","IOC","HINDZINC",
    "BANDHANBNK","FEDERALBNK","IDFCFIRSTB","RBLBANK","YESBANK","BANKBARODA",
    "PNB","CANBK","UNIONBANK","BANKINDIA","INDIANB","AUBANK","EQUITAS",
    "UJJIVANSFB","DCBBANK","LTIM","PERSISTENT","COFORGE","MPHASIS","LTTS",
    "TATAELXSI","CYIENT","AFFLE","NAUKRI","ZOMATO","LUPIN","BIOCON",
    "TORNTPHARM","AUROPHARMA","ALKEM","GLENMARK","BAJAJ-AUTO","TVSMOTOR",
    "ASHOKLEY","ESCORTS","MRF","APOLLOTYRE","CEATLTD","BALKRISIND","BHARATFORG",
    "BOSCHLTD","DABUR","GODREJCP","MARICO","COLPAL","EMAMILTD","VBL","JUBLFOOD",
    "DMART","TRENT","JINDALSTEL","SAIL","NMDC","NATIONALUM","GAIL","PETRONET",
    "IGL","MGL","TATAPOWER","ADANIPOWER","JSWENERGY","NHPC","SUZLON","ACC",
    "AMBUJACEM","RAMCOCEM","DALBHARAT","JKCEMENT","CHOLAFIN","MUTHOOTFIN",
    "MANAPPURAM","PFC","RECLTD","HDFCAMC","HDFCLIFE","SBILIFE","ICICIPRULI",
    "ICICIGI","DLF","GODREJPROP","OBEROIRLTY","PRESTIGE","BRIGADE","SOBHA",
    "PHOENIXLTD","UPL","PIDILITIND","SRF","TATACHEM","AARTIIND","DEEPAKNTR",
    "NAVINFLUOR","PIIND","NCC","NBCC","IRCON","RVNL","IDEA","INDUSTOWER",
    "HFCL","ARVIND","KPRMILL","TRIDENT","WELSPUNIND","ZEEL","SUNTV","PVRINOX",
    "HAL","BEL","BDL","BEML","BHEL","CONCOR","BLUEDART","DELHIVERY",
    "HAVELLS","CROMPTON","VOLTAS","DIXON","POLYCAB","BERGEPAINT","INDIGO",
    "BATAINDIA","IRCTC","RAILTEL","MOTHERSON","EXIDEIND","AMARAJABAT",
    "KEI","KANSAINER","INDIAMART","CDSL","CAMS","NUVOCO","SOBHA",
]

def nse_to_yf(symbol):
    """Convert NSE symbol to Yahoo Finance ticker."""
    # Special cases
    special = {
        "M&M": "M%26M.NS",
        "BAJAJ-AUTO": "BAJAJ-AUTO.NS",
    }
    if symbol in special:
        return special[symbol]
    return f"{symbol}.NS"

# ── ROUTES ──────────────────────────────────────────────────────────

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "time": datetime.now().isoformat()})


@app.route("/api/stock/<symbol>")
def get_stock(symbol):
    """Return real-time quote for a single NSE stock."""
    symbol = symbol.upper()

    def fetch():
        yf_sym = nse_to_yf(symbol)
        ticker = yf.Ticker(yf_sym)
        info = ticker.fast_info  # faster than .info

        current  = float(info.last_price or 0)
        prev     = float(info.previous_close or current)
        change   = round(current - prev, 2)
        chg_pct  = round((change / prev * 100) if prev else 0, 2)
        market_cap = float(getattr(info, "market_cap", 0) or 0)

        hist = ticker.history(period="1d", interval="5m")
        chart_labels = []
        chart_values = []
        if not hist.empty:
            ist = pytz.timezone("Asia/Kolkata")
            for ts, row in hist.iterrows():
                if hasattr(ts, "tz_convert"):
                    ts = ts.tz_convert(ist)
                chart_labels.append(ts.strftime("%H:%M"))
                chart_values.append(round(float(row["Close"]), 2))

        return {
            "status": "success",
            "symbol": symbol,
            "currentPrice": round(current, 2),
            "previousClose": round(prev, 2),
            "change": change,
            "changePercent": chg_pct,
            "marketCap": market_cap,
            "high": round(float(getattr(info, "day_high", current) or current), 2),
            "low":  round(float(getattr(info, "day_low",  current) or current), 2),
            "volume": int(getattr(info, "shares", 0) or 0),
            "chart": {"labels": chart_labels, "values": chart_values},
            "lastUpdated": datetime.now().strftime("%H:%M:%S"),
        }

    try:
        return jsonify(cached(f"stock:{symbol}", fetch))
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "symbol": symbol, "message": str(e)}), 500


@app.route("/api/stocks/batch")
def get_stocks_batch():
    """
    Return quotes for all NSE_SYMBOLS at once.
    Uses yfinance download() which is much faster than individual calls.
    """
    def fetch():
        yf_syms = [nse_to_yf(s) for s in NSE_SYMBOLS]
        # download last 2 days so we can compute prev close
        data = yf.download(yf_syms, period="2d", interval="1d",
                           group_by="ticker", progress=False, auto_adjust=True)
        results = []
        for sym, yf_sym in zip(NSE_SYMBOLS, yf_syms):
            try:
                df = data[yf_sym] if len(yf_syms) > 1 else data
                if df.empty or len(df) < 1:
                    continue
                current   = float(df["Close"].iloc[-1])
                prev      = float(df["Close"].iloc[-2]) if len(df) >= 2 else current
                change    = round(current - prev, 2)
                chg_pct   = round((change / prev * 100) if prev else 0, 2)
                results.append({
                    "symbol": sym,
                    "currentPrice": round(current, 2),
                    "previousClose": round(prev, 2),
                    "change": change,
                    "changePercent": chg_pct,
                })
            except Exception:
                pass
        return {"status": "success", "stocks": results, "count": len(results)}

    try:
        return jsonify(cached("batch:all", fetch))
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/index/<path:symbol>")
def get_index(symbol):
    """
    Fetch a market index quote.
    symbol examples: ^NSEI, ^BSESN, ^CRSLDX
    """
    def fetch():
        ticker = yf.Ticker(symbol)
        info   = ticker.fast_info

        current = float(info.last_price or 0)
        prev    = float(info.previous_close or current)
        change  = round(current - prev, 2)
        chg_pct = round((change / prev * 100) if prev else 0, 2)

        # Intraday chart data
        hist = ticker.history(period="1d", interval="5m")
        chart_labels = []
        chart_values = []
        if not hist.empty:
            ist = pytz.timezone("Asia/Kolkata")
            for ts, row in hist.iterrows():
                if hasattr(ts, "tz_convert"):
                    ts = ts.tz_convert(ist)
                chart_labels.append(ts.strftime("%H:%M"))
                chart_values.append(round(float(row["Close"]), 2))

        return {
            "status": "success",
            "symbol": symbol,
            "current": round(current, 2),
            "previousClose": round(prev, 2),
            "change": change,
            "changePercent": str(chg_pct),
            "high": round(float(getattr(info, "day_high", current) or current), 2),
            "low":  round(float(getattr(info, "day_low",  current) or current), 2),
            "chart": {"labels": chart_labels, "values": chart_values},
            "lastUpdated": datetime.now().strftime("%H:%M:%S"),
        }

    try:
        return jsonify(cached(f"index:{symbol}", fetch))
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "symbol": symbol, "message": str(e)}), 500


@app.route("/api/stock/<symbol>/history")
def get_history(symbol):
    """Return 6-month price history for charts on the analyze page."""
    symbol = symbol.upper()

    def fetch():
        yf_sym = nse_to_yf(symbol)
        ticker = yf.Ticker(yf_sym)
        hist   = ticker.history(period="6mo", interval="1d")

        labels, closes, volumes = [], [], []
        if not hist.empty:
            for ts, row in hist.iterrows():
                labels.append(ts.strftime("%d %b"))
                closes.append(round(float(row["Close"]), 2))
                volumes.append(int(row["Volume"]))

        # Also grab info for PE, 52w high/low etc.
        info = {}
        try:
            raw = ticker.info
            info = {
                "pe":        raw.get("trailingPE"),
                "eps":       raw.get("trailingEps"),
                "week52High":raw.get("fiftyTwoWeekHigh"),
                "week52Low": raw.get("fiftyTwoWeekLow"),
                "avgVolume": raw.get("averageVolume"),
                "dividend":  raw.get("dividendYield"),
                "beta":      raw.get("beta"),
                "bookValue": raw.get("bookValue"),
                "pbRatio":   raw.get("priceToBook"),
                "roe":       raw.get("returnOnEquity"),
                "debtEquity":raw.get("debtToEquity"),
                "industry":  raw.get("industry"),
                "sector":    raw.get("sector"),
                "description": raw.get("longBusinessSummary","")[:400],
            }
        except Exception:
            pass

        return {
            "status": "success",
            "symbol": symbol,
            "chart": {"labels": labels, "closes": closes, "volumes": volumes},
            "info": info,
        }

    try:
        return jsonify(cached(f"history:{symbol}", fetch))
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/gainers")
def get_gainers():
    """Top gainers from our watchlist."""
    try:
        batch = cached("batch:all", lambda: _fetch_batch_inner())
        stocks = batch.get("stocks", [])
        gainers = sorted(stocks, key=lambda x: x["changePercent"], reverse=True)[:10]
        losers  = sorted(stocks, key=lambda x: x["changePercent"])[:10]
        return jsonify({"status": "success", "gainers": gainers, "losers": losers})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


def _fetch_batch_inner():
    """Internal helper reused by gainers endpoint."""
    yf_syms = [nse_to_yf(s) for s in NSE_SYMBOLS[:50]]  # Top 50 only for speed
    data = yf.download(yf_syms, period="2d", interval="1d",
                       group_by="ticker", progress=False, auto_adjust=True)
    results = []
    for sym, yf_sym in zip(NSE_SYMBOLS[:50], yf_syms):
        try:
            df = data[yf_sym] if len(yf_syms) > 1 else data
            if df.empty or len(df) < 1:
                continue
            current = float(df["Close"].iloc[-1])
            prev    = float(df["Close"].iloc[-2]) if len(df) >= 2 else current
            change  = round(current - prev, 2)
            chg_pct = round((change / prev * 100) if prev else 0, 2)
            results.append({"symbol": sym, "currentPrice": round(current, 2),
                            "previousClose": round(prev, 2),
                            "change": change, "changePercent": chg_pct})
        except Exception:
            pass
    return {"status": "success", "stocks": results, "count": len(results)}


if __name__ == "__main__":
    print("=" * 60)
    print("  Vision Trade Backend — Real Indian Stock Prices")
    print("  Powered by yfinance (Yahoo Finance)")
    print("=" * 60)
    print("  Install deps: pip install flask flask-cors yfinance pytz")
    print("  Then run:     python app.py")
    print("  API running at: http://127.0.0.1:5001")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5001, debug=False, threaded=True)
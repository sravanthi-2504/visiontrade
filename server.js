// ================= CORE IMPORTS =================
const express = require('express');
const cors = require('cors');
const path = require('path');

// ================= YAHOO FINANCE =================
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey']
});

// ================= APP SETUP =================
const app = express();
app.use(cors());
app.use(express.json());

// ================= CACHE =================
const cache = new Map();
const CACHE_TTL = 2 * 60 * 1000;

// ================= STATIC FRONTEND =================
app.use(
    express.static(
        path.join(__dirname, 'visiontrade-full', 'frontend', 'public')
    )
);

// ================= ROUTES =================

/* ✅ HOME → DASHBOARD */
app.get('/', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'visiontrade-full',
            'frontend',
            'public',
            'main-dashboard.html'
        )
    );
});

/* ================= API ================= */

/* ✅ HEALTH CHECK */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'VisionTrade backend is running',
        timestamp: Date.now()
    });
});

/* 📊 Stock snapshot */
app.get('/api/stock', async (req, res) => {
    try {
        const symbol = req.query.symbol;
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol required' });
        }

        const yahooSymbol = symbol.toUpperCase() + '.NS';
        const cacheKey = `stock-${yahooSymbol}`;
        const cached = cache.get(cacheKey);

        if (cached && Date.now() - cached.time < CACHE_TTL) {
            return res.json(cached.data);
        }

        console.log('📈 Fetching from Yahoo:', yahooSymbol);

        const quote = await yahooFinance.quote(yahooSymbol);

        if (!quote || !quote.regularMarketPrice) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        let pe = null;
        let marketCap = null;

        try {
            const summary = await yahooFinance.quoteSummary(yahooSymbol, {
                modules: ['summaryDetail', 'defaultKeyStatistics']
            });

            pe = summary?.defaultKeyStatistics?.trailingPE ?? null;
            marketCap = summary?.summaryDetail?.marketCap ?? null;
        } catch {
            console.warn('⚠️ quoteSummary skipped');
        }

        const data = {
            symbol: symbol.toUpperCase(),
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent,
            marketCap,
            pe,
            currency: quote.currency,
            timestamp: Date.now()
        };

        cache.set(cacheKey, { data, time: Date.now() });
        res.json(data);

    } catch (err) {
        console.error('❌ Yahoo error:', err.message);
        res.status(429).json({
            error: 'Rate limited by data provider',
            retryAfter: '30 seconds'
        });
    }
});

/* 📈 Stock history */
app.get('/api/history', async (req, res) => {
    try {
        const { symbol, period = '1y' } = req.query;
        const yahooSymbol = symbol.toUpperCase() + '.NS';

        const now = Math.floor(Date.now() / 1000);
        let period1;
        let interval;

        switch (period) {
            case '1d':
                interval = '5m';
                period1 = now - 1 * 24 * 60 * 60;
                break;
            case '1w':
                interval = '30m';
                period1 = now - 7 * 24 * 60 * 60;
                break;
            case '6m':
                interval = '1d';
                period1 = now - 180 * 24 * 60 * 60;
                break;
            case '1y':
                interval = '1d';
                period1 = now - 365 * 24 * 60 * 60;
                break;
            case '5y':
                interval = '1wk';
                period1 = now - 5 * 365 * 24 * 60 * 60;
                break;
            default:
                interval = '1d';
                period1 = now - 365 * 24 * 60 * 60;
        }

        const result = await yahooFinance.chart(yahooSymbol, {
            period1,
            period2: now,
            interval
        });

        const prices = result.quotes
            .filter(q => q.close)
            .map(q => ({
                time: q.date,
                close: q.close
            }));

        res.json(prices);

    } catch (err) {
        console.error('❌ Chart error:', err.message);
        res.status(429).json({ error: 'Chart data unavailable' });
    }
});

/* 📊 Stock by path param — matches frontend /api/stock/:sym */
app.get('/api/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const yahooSymbol = symbol.toUpperCase() + '.NS';
    try {
        const quote = await yahooFinance.quote(yahooSymbol);
        if (!quote?.regularMarketPrice)
            return res.status(404).json({ status: 'error', message: 'Not found' });
        res.json({
            status: 'success',
            symbol,
            currentPrice: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
        });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

/* 📈 Index data — matches frontend /api/index/:sym */
app.get('/api/index/:symbol', async (req, res) => {
    const sym = decodeURIComponent(req.params.symbol);
    try {
        const quote = await yahooFinance.quote(sym);
        if (!quote?.regularMarketPrice)
            return res.status(404).json({ status: 'error', message: 'Not found' });

        // Get intraday chart
        const now = Math.floor(Date.now() / 1000);
        let chartData = { labels: [], values: [] };
        try {
            const result = await yahooFinance.chart(sym, {
                period1: now - 24 * 60 * 60,
                period2: now,
                interval: '5m'
            });
            chartData.labels = result.quotes
                .filter(q => q.close)
                .map(q => new Date(q.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
            chartData.values = result.quotes
                .filter(q => q.close)
                .map(q => q.close);
        } catch (e) {
            console.warn('⚠️ Chart skipped for', sym);
        }

        res.json({
            status: 'success',
            symbol: sym,
            current: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            high: quote.regularMarketDayHigh,
            low: quote.regularMarketDayLow,
            chart: chartData
        });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

/* 🔍 Market overview — Nifty 50, Sensex, Nifty 500 */
app.get('/api/market-overview', async (req, res) => {
    try {
        const indices = ['^NSEI', '^BSESN', '^CRSLDX'];
        const results = await Promise.allSettled(
            indices.map(sym => yahooFinance.quote(sym))
        );

        const data = results.map((r, i) => ({
            symbol: indices[i],
            price: r.status === 'fulfilled' ? r.value?.regularMarketPrice ?? null : null,
            change: r.status === 'fulfilled' ? r.value?.regularMarketChangePercent ?? null : null,
        }));

        res.json(data);
    } catch (err) {
        console.error('❌ Market overview error:', err.message);
        res.status(500).json({ error: 'Market overview unavailable' });
    }
});

/* 🏆 Top gainers & losers */
app.get('/api/movers', async (req, res) => {
    try {
        const symbols = [
            'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK',
            'SBIN', 'WIPRO', 'HCLTECH', 'ITC', 'BHARTIARTL',
            'LT', 'AXISBANK', 'KOTAKBANK', 'BAJFINANCE', 'ADANIENT'
        ].map(s => s + '.NS');

        const results = await Promise.allSettled(
            symbols.map(sym => yahooFinance.quote(sym))
        );

        const stocks = results
            .filter(r => r.status === 'fulfilled' && r.value?.regularMarketPrice)
            .map(r => ({
                symbol: r.value.symbol.replace('.NS', ''),
                price: r.value.regularMarketPrice,
                change: r.value.regularMarketChangePercent ?? 0,
            }))
            .sort((a, b) => b.change - a.change);

        res.json({
            gainers: stocks.slice(0, 5),
            losers: stocks.slice(-5).reverse()
        });

    } catch (err) {
        console.error('❌ Movers error:', err.message);
        res.status(500).json({ error: 'Movers data unavailable' });
    }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ VisionTrade backend running on http://localhost:${PORT}`);
});
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
const CACHE_TTL =  2 * 60 * 1000;

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
                period1 = now - 1 * 24 * 60 * 60; // last 1 day ✅
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


// ================= START SERVER =================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ VisionTrade backend running on http://localhost:${PORT}`);
});

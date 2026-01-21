// src/components/RealStockDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetch3500RealStocks, getRealTimeQuote } from '../api/stockData';
import '../css/dashboard.css';

function RealStockDashboard() {
    const [stocks, setStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('All');
    const [page, setPage] = useState(1);
    const [realTimeUpdates, setRealTimeUpdates] = useState({});
    const itemsPerPage = 25;

    // Load stocks
    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        setLoading(true);
        const data = await fetch3500RealStocks();
        setStocks(data);
        setFilteredStocks(data);
        setLoading(false);

        // Fetch real-time prices for top 50 stocks
        fetchRealTimePrices(data.slice(0, 50));
    };

    // Fetch real-time prices
    const fetchRealTimePrices = async (stockList) => {
        const updates = {};
        for (const stock of stockList) {
            const cleanSymbol = stock.symbol.replace('.NS', '').replace('.BO', '');
            const quote = await getRealTimeQuote(cleanSymbol);
            if (quote) {
                updates[stock.id] = {
                    price: quote.price,
                    change: quote.change,
                    changePercent: quote.changesPercentage
                };
            }
        }
        setRealTimeUpdates(updates);
    };

    // Filter stocks
    useEffect(() => {
        let filtered = [...stocks];

        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(s =>
                s.symbol.toLowerCase().includes(term) ||
                s.name.toLowerCase().includes(term)
            );
        }

        if (sector !== 'All') {
            filtered = filtered.filter(s => s.sector === sector);
        }

        setFilteredStocks(filtered);
        setPage(1);
    }, [search, sector, stocks]);

    // Get sectors
    const sectors = ['All', ...new Set(stocks.map(s => s.sector))].sort();

    // Pagination
    const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, filteredStocks.length);
    const currentStocks = filteredStocks.slice(startIdx, endIdx);

    // Stats
    const stats = {
        total: stocks.length,
        filtered: filteredStocks.length,
        advances: filteredStocks.filter(s => s.change > 0).length,
        declines: filteredStocks.filter(s => s.change < 0).length,
        marketCap: `₹${(filteredStocks.reduce((sum, s) => sum + (parseFloat(s.marketCap.replace('₹', '').replace('L Cr', '')) || 0), 0) * 100000).toFixed(0)} Cr`
    };

    // Format price with real-time update
    const getPrice = (stock) => {
        if (realTimeUpdates[stock.id]) {
            return realTimeUpdates[stock.id].price.toFixed(2);
        }
        return typeof stock.currentPrice === 'number' ? stock.currentPrice.toFixed(2) : '0.00';
    };

    // Format change with real-time update
    const getChange = (stock) => {
        if (realTimeUpdates[stock.id]) {
            return realTimeUpdates[stock.id].change.toFixed(2);
        }
        return typeof stock.change === 'number' ? stock.change.toFixed(2) : '0.00';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <h2>Loading 3500 Real Indian Stocks...</h2>
                <p>Fetching real-time market data from API</p>
                <div className="loading-progress">
                    <div className="progress-bar"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="real-stock-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>📈 Real Indian Stock Market</h1>
                <h2>3500+ Stocks with Real-Time Prices</h2>

                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-label">Total Stocks</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Advances</span>
                        <span className="stat-value green">{stats.advances}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Declines</span>
                        <span className="stat-value red">{stats.declines}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">{stats.marketCap}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-section">
                <input
                    type="text"
                    placeholder="🔍 Search 3500 stocks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-box"
                />

                <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="sector-select"
                >
                    {sectors.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <button onClick={loadStocks} className="refresh-btn">
                    🔄 Refresh Data
                </button>
            </div>

            {/* Table */}
            <div className="stocks-table-container">
                <div className="table-header">
                    <div className="header-cell">Symbol</div>
                    <div className="header-cell">Company Name</div>
                    <div className="header-cell">Sector</div>
                    <div className="header-cell">Market Cap</div>
                    <div className="header-cell">Price (₹)</div>
                    <div className="header-cell">Change</div>
                    <div className="header-cell">Volume</div>
                    <div className="header-cell">P/E</div>
                </div>

                <div className="table-body">
                    {currentStocks.map(stock => {
                        const change = getChange(stock);
                        const isPositive = parseFloat(change) >= 0;

                        return (
                            <div key={stock.id} className="table-row">
                                <div className="cell">
                                    <strong>{stock.symbol}</strong>
                                    {realTimeUpdates[stock.id] && <span className="live-badge">LIVE</span>}
                                </div>
                                <div className="cell" title={stock.name}>
                                    {stock.name.length > 30 ? stock.name.substring(0, 30) + '...' : stock.name}
                                </div>
                                <div className="cell">
                                    <span className={`sector-tag sector-${stock.sector.toLowerCase().replace(/ /g, '-')}`}>
                                        {stock.sector}
                                    </span>
                                </div>
                                <div className="cell">{stock.marketCap}</div>
                                <div className="cell">
                                    <strong>₹{getPrice(stock)}</strong>
                                </div>
                                <div className={`cell ${isPositive ? 'positive' : 'negative'}`}>
                                    {isPositive ? '+' : ''}{change} ({stock.changePercent}%)
                                </div>
                                <div className="cell">
                                    {stock.volume.toLocaleString()}
                                </div>
                                <div className="cell">{stock.peRatio}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination */}
            <div className="pagination-controls">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                >
                    ← Previous
                </button>

                <div className="page-info">
                    Page {page} of {totalPages} •
                    Showing {startIdx + 1}-{endIdx} of {filteredStocks.length} stocks
                </div>

                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="pagination-btn"
                >
                    Next →
                </button>
            </div>

            {/* Footer */}
            <div className="dashboard-footer">
                <div className="data-info">
                    <span className="info-item">
                        📊 Total Stocks: {stats.total}
                    </span>
                    <span className="info-item">
                        🔍 Filtered: {stats.filtered}
                    </span>
                    <span className="info-item">
                        ⚡ Real-time Data: {Object.keys(realTimeUpdates).length} stocks
                    </span>
                </div>
                <div className="api-info">
                    Data provided by Financial Modeling Prep API
                </div>
            </div>
        </div>
    );
}

export default RealStockDashboard;
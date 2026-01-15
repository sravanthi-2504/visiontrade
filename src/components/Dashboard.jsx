// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    // Your Excel data
    const excelStockData = [
        { Ticker: 'RELIANCE', CompanyName: 'Reliance Industries Limited' },
        { Ticker: 'MCX', CompanyName: 'Multi Commodity Exchange of India Limited' },
        { Ticker: 'VGUARD', CompanyName: 'V-Guard Industries Limited' },
        { Ticker: 'RECLTD', CompanyName: 'REC Limited' },
        { Ticker: 'TCS', CompanyName: 'Tata Consultancy Services Limited' },
        { Ticker: 'HDFCBANK', CompanyName: 'HDFC Bank Limited' },
        { Ticker: 'INFY', CompanyName: 'Infosys Limited' },
        { Ticker: 'HINDUNILVR', CompanyName: 'Hindustan Unilever Limited' },
        { Ticker: 'ICICIBANK', CompanyName: 'ICICI Bank Limited' },
        { Ticker: 'SBIN', CompanyName: 'State Bank of India' },
        { Ticker: 'BAJFINANCE', CompanyName: 'Bajaj Finance Limited' },
        { Ticker: 'BHARTIARTL', CompanyName: 'Bharti Airtel Limited' },
        { Ticker: 'ITC', CompanyName: 'ITC Limited' },
        { Ticker: 'KOTAKBANK', CompanyName: 'Kotak Mahindra Bank Limited' },
        { Ticker: 'AXISBANK', CompanyName: 'Axis Bank Limited' },
        { Ticker: 'LT', CompanyName: 'Larsen & Toubro Limited' },
        { Ticker: 'WIPRO', CompanyName: 'Wipro Limited' },
        { Ticker: 'SUNPHARMA', CompanyName: 'Sun Pharmaceutical Industries Limited' },
        { Ticker: 'ONGC', CompanyName: 'Oil & Natural Gas Corporation Limited' },
        { Ticker: 'ULTRACEMCO', CompanyName: 'UltraTech Cement Limited' },
    ];

    // Create a mapping dictionary
    const symbolToNameMap = {};
    excelStockData.forEach(stock => {
        symbolToNameMap[stock.Ticker] = stock.CompanyName;
    });

    // ✅ REMOVED: Real Estate, Metals, Chemicals, Industrial Manufacturing, Media, Oil & Gas, Power, Retail, Textiles, Transportation, Miscellaneous
    const [sectors, setSectors] = useState(['All', 'Banking', 'IT', 'Energy', 'FMCG', 'Automobile', 'Pharmaceuticals', 'Telecom', 'Cement', 'Construction', 'Consumer Durables', 'Finance', 'Healthcare', 'Insurance', 'Logistics']);

    const [stocks, setStocks] = useState([
        { symbol: 'RELIANCE97.NS', price: 1654.09, change: 0.33, marketCap: 'Large Cap' },
        { symbol: 'MCX31.NS', price: 11010.61, change: 0.05, marketCap: 'Large Cap' },
        { symbol: 'VGUARD86.NS', price: 1525.43, change: -0.38, marketCap: 'Small Cap' },
        { symbol: 'RECLTD43.NS', price: 3948.74, change: 0.08, marketCap: 'Mid Cap' },
        { symbol: 'TCS95.NS', price: 3850.50, change: 1.25, marketCap: 'Large Cap' },
        { symbol: 'HDFCBANK82.NS', price: 1680.75, change: 0.45, marketCap: 'Large Cap' },
        { symbol: 'INFY78.NS', price: 1550.20, change: -0.15, marketCap: 'Large Cap' },
        { symbol: 'HINDUNILVR91.NS', price: 2450.80, change: 0.72, marketCap: 'Large Cap' },
        { symbol: 'ICICIBANK88.NS', price: 1050.30, change: 0.28, marketCap: 'Large Cap' },
        { symbol: 'SBIN76.NS', price: 620.45, change: 1.05, marketCap: 'Large Cap' },
    ]);

    const [marketStats, setMarketStats] = useState({
        isOpen: true,
        time: '11:24 am',
        companies: 3500,
        advances: 1797,
        declines: 1703,
        marketCap: '₹1329 Cr',
        lastUpdated: '11:24'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('All');

    const cleanSymbol = (rawSymbol) => {
        if (!rawSymbol) return '';
        return rawSymbol.replace(/[0-9]+\.NS$/, '');
    };

    const getCompanyName = (cleanedSymbol) => {
        return symbolToNameMap[cleanedSymbol] || cleanedSymbol;
    };

    const getSector = (cleanedSymbol) => {
        const sectorMapping = {
            'RELIANCE': 'Energy',
            'MCX': 'Finance',
            'VGUARD': 'Consumer Durables',
            'RECLTD': 'Finance',
            'TCS': 'IT',
            'HDFCBANK': 'Banking',
            'INFY': 'IT',
            'HINDUNILVR': 'FMCG',
            'ICICIBANK': 'Banking',
            'SBIN': 'Banking',
            'BAJFINANCE': 'Finance',
            'BHARTIARTL': 'Telecom',
            'ITC': 'FMCG',
            'KOTAKBANK': 'Banking',
            'AXISBANK': 'Banking',
            'LT': 'Construction',
            'WIPRO': 'IT',
            'SUNPHARMA': 'Pharmaceuticals',
            'ONGC': 'Energy',
            'ULTRACEMCO': 'Cement',
        };

        return sectorMapping[cleanedSymbol] || 'Finance';
    };

    const processStockData = () => {
        return stocks.map(stock => {
            const cleanedSymbol = cleanSymbol(stock.symbol);
            const companyName = getCompanyName(cleanedSymbol);
            const sector = getSector(cleanedSymbol);

            return {
                ...stock,
                cleanedSymbol,
                companyName,
                sector,
                displaySymbol: cleanedSymbol,
            };
        });
    };

    const filteredStocks = processStockData().filter(stock => {
        const matchesSearch = stock.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.cleanedSymbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;

        return matchesSearch && matchesSector;
    });

    const handleAddStock = (symbol, companyName) => {
        alert(`Added ${companyName} to your portfolio`);
    };

    const handleAnalyzeStock = (symbol, companyName) => {
        alert(`Analyzing ${companyName}`);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(prevStocks =>
                prevStocks.map(stock => ({
                    ...stock,
                    price: stock.price + (Math.random() - 0.5) * 10,
                    change: stock.change + (Math.random() - 0.5) * 0.1
                }))
            );

            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            setMarketStats(prev => ({
                ...prev,
                time: timeStr,
                lastUpdated: now.getHours().toString().padStart(2, '0') + ':' +
                    now.getMinutes().toString().padStart(2, '0')
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Market Dashboard</h1>
                <div className="market-status">
          <span className={`status-indicator ${marketStats.isOpen ? 'open' : 'closed'}`}>
            ●
          </span>
                    <span className="status-text">
            Market: <strong>{marketStats.isOpen ? 'OPEN' : 'CLOSED'}</strong>
          </span>
                    <span className="time">Time: {marketStats.time}</span>
                    <span className="companies">Companies: {marketStats.companies.toLocaleString()}</span>
                </div>
            </header>

            {/* ✅ This is where the sectors dropdown is */}
            <div className="controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search stocks by symbol or company name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button className="search-button">🔍</button>
                </div>

                <div className="filters">
                    <div className="sector-filter">
                        <label>Sector: </label>
                        <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="sector-select"
                        >
                            {sectors.map(sector => (
                                <option key={sector} value={sector}>{sector}</option>
                            ))}
                        </select>
                    </div>

                    <button className="refresh-button" onClick={() => window.location.reload()}>
                        ↻ Refresh
                    </button>
                </div>
            </div>

            <div className="market-stats">
                <div className="stat-card advances">
                    <div className="stat-label">Advances</div>
                    <div className="stat-value">{marketStats.advances}</div>
                </div>

                <div className="stat-card declines">
                    <div className="stat-label">Declines</div>
                    <div className="stat-value">{marketStats.declines}</div>
                </div>

                <div className="stat-card market-cap">
                    <div className="stat-label">Market Cap</div>
                    <div className="stat-value">{marketStats.marketCap}</div>
                </div>

                <div className="stat-card last-updated">
                    <div className="stat-label">Last Updated</div>
                    <div className="stat-value">{marketStats.lastUpdated}</div>
                </div>
            </div>

            <div className="stocks-table-container">
                <table className="stocks-table">
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Company Name</th>
                        <th>Sector</th>
                        <th>Price (₹)</th>
                        <th>Change %</th>
                        <th>Market Cap</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStocks.length > 0 ? (
                        filteredStocks.map((stock, index) => (
                            <tr key={index}>
                                <td className="symbol-cell">
                                    <span className="symbol">{stock.displaySymbol}</span>
                                </td>
                                <td className="company-name">
                                    {stock.companyName}
                                </td>
                                <td className="sector-cell">
                    <span className={`sector-badge`}>
                      {stock.sector}
                    </span>
                                </td>
                                <td className="price-cell">
                                    ₹{stock.price.toFixed(2)}
                                </td>
                                <td className={`change-cell ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                                    {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                                </td>
                                <td className="market-cap-cell">
                    <span className={`cap-badge ${stock.marketCap.toLowerCase().replace(' ', '-')}`}>
                      {stock.marketCap}
                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="action-btn analyze-btn"
                                        onClick={() => handleAnalyzeStock(stock.symbol, stock.companyName)}
                                    >
                                        📊 Analyze
                                    </button>
                                    <button
                                        className="action-btn add-btn"
                                        onClick={() => handleAddStock(stock.symbol, stock.companyName)}
                                    >
                                        ➕ Add
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-companies">
                                No companies found. Try adjusting your filters.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Market News Section - Remove if not needed */}
            <div className="market-news">
                <h2>Market News</h2>
                <div className="news-item">
                    <h3>World's fourth-largest AMC State Street invests in Groww AMC to transform investing in India</h3>
                    <p className="news-source">indianstartupnews • 17 hours ago</p>
                </div>
                <div className="news-item">
                    <h3>Rs 731666404000: Mukesh Ambani loses huge amount of money in just 13 days, now out of..., his net worth is now Rs...</h3>
                    <p className="news-source">news24online • 18 hours ago</p>
                </div>
                <div className="news-item">
                    <h3>Indian Oil targets 20-30% revenue from non-fuel biz by 2030: AS Sahney, Chairman</h3>
                    <p className="news-source">economictimes_indiatimes • 18 hours ago</p>
                </div>
            </div>

            <footer className="dashboard-footer">
                <p>Showing {filteredStocks.length} of {stocks.length} stocks</p>
                <p>Data updates every 5 seconds • Last updated: {marketStats.lastUpdated}</p>
            </footer>
        </div>
    );
};

export default Dashboard;
// src/components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({
                       // Basic props
                       loading,
                       currentCompanies = [],
                       currentDate,
                       marketStatus,
                       marketTime,
                       marketStats,

                       // Filter props
                       searchTerm,
                       setSearchTerm,
                       selectedSector,
                       setSelectedSector,
                       selectedIndex,
                       setSelectedIndex,
                       selectedMarketCap,
                       handleMarketCapFilter,

                       // Data props
                       sectors = [],
                       indices = [],
                       marketCapCategories = [],
                       news = [],
                       newsCategory,
                       setNewsCategory,

                       // Navigation props
                       handleAnalyzeNavigation,

                       // Helper functions
                       formatNumber = (num) => num?.toString() || '0',
                       getRecommendationColor,
                       getRiskColor,
                       getOutlookColor,
                       getMarketCapCategory,

                       // UI state props
                       showNewsModal,
                       setShowNewsModal,
                       showAuthModal,
                       setShowAuthModal,
                       user,
                       setUser,
                       authMode,
                       setAuthMode,

                       // Other optional props with defaults
                       portfolio = { stocks: [] },
                       addToPortfolio = () => console.log('Add to portfolio'),
                   }) => {
    const navigate = useNavigate();

    // Handle analyze click with fallback
    const handleAnalyzeClick = (company) => {
        if (handleAnalyzeNavigation) {
            handleAnalyzeNavigation(company);
        } else {
            navigate(`/analyze/${company.symbol}`);
        }
    };

    // If loading, show loading state
    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading market data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1>Market Dashboard</h1>
                <div className="dashboard-subheader">
          <span className="market-status">
            Market: <span className={`status ${marketStatus}`}>{marketStatus?.toUpperCase() || 'CLOSED'}</span>
          </span>
                    <span className="market-time">
            Time: {marketTime || '--:--'}
          </span>
                    <span className="total-companies">
            Companies: {formatNumber(marketStats?.totalCompanies || 0)}
          </span>
                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="dashboard-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search stocks by symbol or name..."
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-container">
                    <select
                        value={selectedSector || 'All'}
                        onChange={(e) => setSelectedSector && setSelectedSector(e.target.value)}
                        className="filter-select"
                    >
                        <option value="All">All Sectors</option>
                        {sectors.map((sector, index) => (
                            <option key={index} value={sector.name || sector}>
                                {sector.name || sector}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedIndex || 'All'}
                        onChange={(e) => setSelectedIndex && setSelectedIndex(e.target.value)}
                        className="filter-select"
                    >
                        <option value="All">All Indices</option>
                        {indices.map((index, idx) => (
                            <option key={idx} value={index}>{index}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Market Stats */}
            <div className="market-stats">
                <div className="stat-card">
                    <div className="stat-label">Advances</div>
                    <div className="stat-value positive">{formatNumber(marketStats?.advances || 0)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Declines</div>
                    <div className="stat-value negative">{formatNumber(marketStats?.declines || 0)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Market Cap</div>
                    <div className="stat-value">{marketStats?.totalMarketCap || '₹0 Cr'}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Last Updated</div>
                    <div className="stat-value">
                        {currentDate ? currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </div>
                </div>
            </div>

            {/* Stocks Table */}
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
                    {currentCompanies && currentCompanies.length > 0 ? (
                        currentCompanies.map((company, index) => {
                            const isInPortfolio = portfolio?.stocks?.some(item => item.symbol === company.symbol);

                            return (
                                <tr key={company.id || company.symbol || index}>
                                    <td className="symbol-cell">
                                        <strong>{company.symbol}</strong>
                                    </td>
                                    <td className="name-cell">{company.name}</td>
                                    <td className="sector-cell">{company.sector}</td>
                                    <td className="price-cell">₹{formatNumber(company.price)}</td>
                                    <td className={`change-cell ${company.changePercent >= 0 ? 'positive' : 'negative'}`}>
                                        {company.changePercent >= 0 ? '▲' : '▼'} {Math.abs(company.changePercent || 0).toFixed(2)}%
                                    </td>
                                    <td className="cap-cell">
                                        {getMarketCapCategory ? getMarketCapCategory(company.marketCap) : 'N/A'}
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            className="action-btn analyze-btn"
                                            onClick={() => handleAnalyzeClick(company)}
                                        >
                                            Analyze
                                        </button>
                                        <button
                                            className={`action-btn portfolio-btn ${isInPortfolio ? 'added' : ''}`}
                                            onClick={() => addToPortfolio(company)}
                                            disabled={isInPortfolio}
                                        >
                                            {isInPortfolio ? '✓ Added' : '+ Add'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data">
                                No companies found. Try adjusting your filters.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Quick News Section */}
            <div className="quick-news">
                <div className="quick-news-header">
                    <h3>Market News</h3>
                    <button
                        className="view-all-news"
                        onClick={() => setShowNewsModal && setShowNewsModal(true)}
                    >
                        View All →
                    </button>
                </div>
                <div className="news-items">
                    {news.slice(0, 3).map((item, index) => (
                        <div key={index} className="news-item">
                            <div className="news-title">{item.title}</div>
                            <div className="news-meta">
                                <span className="news-source">{item.source}</span>
                                <span className="news-time">{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User/Auth Section */}
            <div className="user-section">
                {user ? (
                    <div className="user-info">
                        <span className="user-name">Welcome, {user.name}</span>
                        <button
                            className="logout-btn"
                            onClick={() => setUser && setUser(null)}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <button
                            className="auth-btn signin-btn"
                            onClick={() => {
                                setShowAuthModal && setShowAuthModal(true);
                                setAuthMode && setAuthMode('signin');
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            className="auth-btn signup-btn"
                            onClick={() => {
                                setShowAuthModal && setShowAuthModal(true);
                                setAuthMode && setAuthMode('signup');
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
// src/components/DashboardWrapper.jsx
import React from 'react';
import '../css/dashboard.css';

function DashboardWrapper({
                              allStocks,
                              filteredStocks,
                              loading,
                              searchTerm,
                              setSearchTerm,
                              selectedSector,
                              setSelectedSector,
                              sectors,
                              currentPage,
                              setCurrentPage,
                              itemsPerPage,
                              paginatedStocks,
                              totalPages,
                              marketStats
                          }) {
    if (loading) {
        return (
            <div className="loading-screen">
                <h1>🇮🇳 Indian Stocks Dashboard</h1>
                <h2>3500+ Stocks with Sector Classification</h2>
                <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div>
                <p>Loading 3500+ stocks...</p>
                <p>Applying sector classification...</p>
                <p>Loaded {allStocks.length} of 3500 stocks ({Math.round(allStocks.length/3500*100)}%)</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h1>🇮🇳 Indian Stocks Dashboard</h1>
                <h2>3500+ Stocks with Sector Classification</h2>
                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-label">Total Stocks</span>
                        <span className="stat-value">{marketStats.totalCompanies}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Advances</span>
                        <span className="stat-value positive">{marketStats.advances}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Declines</span>
                        <span className="stat-value negative">{marketStats.declines}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">{marketStats.totalMarketCap}</span>
                    </div>
                </div>
            </header>

            {/* Controls */}
            <div className="controls-row">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Search stocks by symbol or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="sector-filter">
                    <select
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="sector-select"
                    >
                        {sectors.map(sector => (
                            <option key={sector} value={sector}>
                                {sector === 'All' ? 'All Sectors' : sector}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table Header */}
            <div className="table-header">
                <div className="header-cell">Symbol & Company</div>
                <div className="header-cell">Sector</div>
                <div className="header-cell">Market Cap</div>
                <div className="header-cell">Recommendation</div>
                <div className="header-cell">Risk Level</div>
                <div className="header-cell">Current Price</div>
                <div className="header-cell">Actions</div>
            </div>

            {/* Stocks Table */}
            <div className="stocks-table">
                {paginatedStocks.length === 0 ? (
                    <div className="no-results">
                        No stocks found. Try a different search.
                    </div>
                ) : (
                    paginatedStocks.map((stock, index) => (
                        <div key={stock.id} className="stock-row">
                            <div className="table-cell">
                                <div className="stock-symbol">{stock.symbol}</div>
                                <div className="stock-name">{stock.name}</div>
                            </div>
                            <div className="table-cell">
                                <span className={`sector-badge sector-${stock.sector.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {stock.sector}
                                </span>
                            </div>
                            <div className="table-cell">
                                {stock.marketCap}
                            </div>
                            <div className="table-cell">
                                <span className={`recommendation ${stock.recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {stock.recommendation}
                                </span>
                            </div>
                            <div className="table-cell">
                                <span className={`risk-level ${stock.riskLevel.toLowerCase()}`}>
                                    {stock.riskLevel}
                                </span>
                            </div>
                            <div className="table-cell">
                                <div className="price">{stock.price}</div>
                                <div className={`change ${stock.rawChange >= 0 ? 'positive' : 'negative'}`}>
                                    {stock.change}
                                </div>
                            </div>
                            <div className="table-cell">
                                <button className="analyze-btn">Analyze</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    ← Previous
                </button>

                <div className="page-info">
                    Page {currentPage} of {totalPages} •
                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredStocks.length)} of {filteredStocks.length} stocks
                </div>

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next →
                </button>
            </div>

            {/* Footer */}
            <div className="dashboard-footer">
                <p>Page {currentPage} of {totalPages} • {itemsPerPage} stocks per page</p>
                <p>Total: {filteredStocks.length} stocks • Filtered from {allStocks.length} total stocks</p>
            </div>
        </div>
    );
}

export default DashboardWrapper;
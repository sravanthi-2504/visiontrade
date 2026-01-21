import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../css/VirtualStockList.css';

const VirtualStockList = ({
                              stocks = [],
                              itemsPerPage = 50,
                              itemHeight = 70,
                              containerHeight = 600,
                              currentPage = 1,
                              setCurrentPage,
                              onStockClick,
                              onAddToPortfolio,
                              portfolio = { stocks: [] },
                              totalStocks = 0
                          }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);

    // Handle scroll
    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);

    // Calculate visible items for virtual scrolling
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 5; // Buffer
    const endIndex = Math.min(startIndex + visibleItems, stocks.length);

    // Calculate pagination
    const totalPages = Math.ceil(stocks.length / itemsPerPage);
    const paginatedStocks = stocks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Virtual scroll items (only render visible ones)
    const visibleStocks = stocks.slice(startIndex, endIndex);

    // Handle page change with validation
    const handlePrevPage = () => {
        if (currentPage > 1 && setCurrentPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages && setCurrentPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Check if stock is in portfolio
    const isInPortfolio = (stock) => {
        if (!portfolio || !portfolio.stocks) return false;
        return portfolio.stocks.some(item => item.symbol === stock.symbol);
    };

    // Handle stock click
    const handleStockClick = (stock) => {
        if (onStockClick) {
            onStockClick(stock);
        }
    };

    // Handle add to portfolio click
    const handleAddClick = (stock, e) => {
        e.stopPropagation(); // Prevent triggering row click
        if (onAddToPortfolio) {
            onAddToPortfolio(stock);
        }
    };

    // Format change value with color
    const getChangeDisplay = (change) => {
        const changeValue = parseFloat(change) || 0;
        const isPositive = changeValue >= 0;
        const changePercent = ((changeValue / (parseFloat(stocks[0]?.price) || 1)) * 100) || 0;

        return (
            <span className={`change-display ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(changeValue).toFixed(2)}
                ({Math.abs(changePercent).toFixed(2)}%)
            </span>
        );
    };

    // Format price
    const formatPrice = (price) => {
        const priceNum = parseFloat(price) || 0;
        return `₹${priceNum.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Reset scroll when page changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
            setScrollTop(0);
        }
    }, [currentPage]);

    // If no stocks, show empty state
    if (!stocks || stocks.length === 0) {
        return (
            <div className="virtual-stock-container empty-state">
                <div className="empty-state-content">
                    <div className="empty-state-icon">📭</div>
                    <h4>No stocks available</h4>
                    <p>Try adjusting your filters or refresh the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="virtual-stock-container">
            {/* Stats Header */}
            <div className="virtual-stats">
                <div className="stats-left">
                    <span className="stock-count">
                        📊 Showing {stocks.length.toLocaleString()} stocks
                        {totalStocks > 0 && ` (of ${totalStocks.toLocaleString()} total)`}
                    </span>
                    <span className="virtual-hint">
                        Virtual scrolling: {visibleItems} rendered at a time
                    </span>
                </div>
                <div className="stats-right">
                    <span className="page-indicator">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </div>

            {/* Column Headers */}
            <div className="column-headers">
                <div className="header-symbol">Symbol</div>
                <div className="header-name">Company Name</div>
                <div className="header-price">Price</div>
                <div className="header-change">Change</div>
                <div className="header-sector">Sector</div>
                <div className="header-actions">Actions</div>
            </div>

            {/* Virtual Scroll Container */}
            <div
                ref={containerRef}
                className="virtual-scroll-container"
                style={{ height: `${containerHeight}px` }}
                onScroll={handleScroll}
            >
                <div
                    className="virtual-scroll-content"
                    style={{ height: `${stocks.length * itemHeight}px` }}
                >
                    {visibleStocks.map((stock, index) => {
                        const actualIndex = startIndex + index;
                        const inPortfolio = isInPortfolio(stock);
                        const changeValue = parseFloat(stock.change) || 0;
                        const changePercent = parseFloat(stock.changePercent) || 0;

                        return (
                            <div
                                key={`${stock.symbol || stock.id || actualIndex}-${actualIndex}`}
                                className={`stock-row ${inPortfolio ? 'in-portfolio' : ''}`}
                                style={{
                                    position: 'absolute',
                                    top: `${actualIndex * itemHeight}px`,
                                    height: `${itemHeight}px`,
                                    width: '100%'
                                }}
                                onClick={() => handleStockClick(stock)}
                            >
                                <div className="stock-symbol">
                                    <strong>{stock.symbol || 'N/A'}</strong>
                                    {stock.isRealStock && <span className="real-badge">✓</span>}
                                </div>

                                <div className="stock-name" title={stock.name || ''}>
                                    <span className="name-text">
                                        {stock.name || 'N/A'}
                                    </span>
                                    {stock.name && stock.name.length > 40 && (
                                        <span className="ellipsis">...</span>
                                    )}
                                </div>

                                <div className="stock-price">
                                    {formatPrice(stock.price || stock.currentPrice || 0)}
                                </div>

                                <div className={`stock-change ${changeValue >= 0 ? 'positive' : 'negative'}`}>
                                    {changeValue >= 0 ? '▲' : '▼'} {Math.abs(changeValue).toFixed(2)}
                                    <span className="change-percent">
                                        ({Math.abs(changePercent).toFixed(2)}%)
                                    </span>
                                </div>

                                <div className="stock-sector">
                                    <span className="sector-badge">
                                        {stock.sector || 'N/A'}
                                    </span>
                                </div>

                                <div className="stock-actions">
                                    <button
                                        className="action-btn analyze-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStockClick(stock);
                                        }}
                                        title="Analyze stock"
                                    >
                                        Analyze
                                    </button>
                                    <button
                                        className={`action-btn portfolio-btn ${inPortfolio ? 'added' : ''}`}
                                        onClick={(e) => handleAddClick(stock, e)}
                                        disabled={inPortfolio}
                                        title={inPortfolio ? 'Already in portfolio' : 'Add to portfolio'}
                                    >
                                        {inPortfolio ? '✓ Added' : '+ Add'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    className="pagination-btn prev-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || !setCurrentPage}
                >
                    ← Previous
                </button>

                <div className="page-info">
                    <span className="page-numbers">
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <span className="items-info">
                        {itemsPerPage} stocks per page
                    </span>
                </div>

                <button
                    className="pagination-btn next-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || !setCurrentPage}
                >
                    Next →
                </button>
            </div>

            {/* Scroll Info & Performance */}
            <div className="scroll-info">
                <div className="scroll-position">
                    <span className="scroll-stats">
                        Scrolled: <strong>{Math.round(scrollTop)}px</strong> •
                        Viewing items <strong>{startIndex + 1}</strong>-<strong>{endIndex}</strong> of <strong>{stocks.length}</strong>
                    </span>
                </div>
                <div className="performance-info">
                    <span className="performance-tip">
                        ⚡ Performance: {visibleItems} of {stocks.length} stocks rendered
                    </span>
                    <span className="memory-info">
                        Memory: ~{(stocks.length * 0.5).toFixed(0)}KB used
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VirtualStockList;
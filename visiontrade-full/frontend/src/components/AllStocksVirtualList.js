// src/components/AllStocksVirtualList.js
import React, { useState, useRef, useCallback } from 'react';
import '../css/AllStocksVirtualList.css';

function AllStocksVirtualList({ stocks }) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);

    const ITEM_HEIGHT = 60;
    const CONTAINER_HEIGHT = 600; // Fixed height

    // Calculate visible items
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 5);
    const endIndex = Math.min(
        stocks.length,
        startIndex + Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 10
    );

    const visibleStocks = stocks.slice(startIndex, endIndex);

    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);

    return (
        <div className="all-stocks-container">
            <h1>All Indian Stocks ({stocks.length})</h1>

            <div
                ref={containerRef}
                className="virtual-list-container"
                onScroll={handleScroll}
                style={{ height: `${CONTAINER_HEIGHT}px` }}
            >
                <div
                    className="virtual-list-content"
                    style={{ height: `${stocks.length * ITEM_HEIGHT}px` }}
                >
                    {visibleStocks.map((stock, index) => {
                        const actualIndex = startIndex + index;

                        return (
                            <div
                                key={stock.id}
                                className="stock-item"
                                style={{
                                    position: 'absolute',
                                    top: `${actualIndex * ITEM_HEIGHT}px`,
                                    height: `${ITEM_HEIGHT}px`,
                                    width: '100%'
                                }}
                            >
                                <div className="item-content">
                                    <div className="stock-info">
                                        <div className="symbol">{stock.symbol}</div>
                                        <div className="name">{stock.name}</div>
                                    </div>
                                    <div className="stock-details">
                                        <div className="sector">{stock.sector}</div>
                                        <div className="market-cap">{stock.marketCap}</div>
                                        <div className="price">{stock.price}</div>
                                        <div className={`change ${stock.rawChange >= 0 ? 'positive' : 'negative'}`}>
                                            {stock.change}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="list-footer">
                Showing {startIndex + 1} - {endIndex} of {stocks.length} stocks
                <div className="scroll-position">Scroll: {Math.round(scrollTop)}px</div>
            </div>
        </div>
    );
}

export default AllStocksVirtualList;
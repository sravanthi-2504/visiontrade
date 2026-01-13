// src/components/Dashboard.jsx
import React from 'react';
import { usePortfolio } from './portfolio-context';

const Dashboard = () => {
    const { addToPortfolio, portfolio } = usePortfolio();

    // Sample stock data - you can modify this with real data
    const stocks = [
        {
            id: 1,
            symbol: 'TCS',
            name: 'Tata Consultancy Services',
            sector: 'IT',
            price: 3705,
            change: '+11.7%',
            risk: 'Medium'
        },
        {
            id: 2,
            symbol: 'RELIANCE',
            name: 'Reliance Industries',
            sector: 'Energy',
            price: 2350,
            change: '+10.9%',
            risk: 'Low'
        },
        {
            id: 3,
            symbol: 'INFOSYS',
            name: 'Infosys Ltd',
            sector: 'IT',
            price: 1615,
            change: '+13.3%',
            risk: 'Medium'
        },
        {
            id: 4,
            symbol: 'HDFC',
            name: 'HDFC Bank',
            sector: 'Banking',
            price: 1680,
            change: '+13.7%',
            risk: 'Low'
        },
        {
            id: 5,
            symbol: 'TATAMOTORS',
            name: 'Tata Motors',
            sector: 'Auto',
            price: 662,
            change: '+15.2%',
            risk: 'Moderate'
        },
        {
            id: 6,
            symbol: 'ADANIGREEN',
            name: 'Adani Green Energy',
            sector: 'Energy',
            price: 850,
            change: '-36.2%',
            risk: 'High'
        }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Market Dashboard</h1>
                <p className="subtitle">Select stocks to add to your portfolio</p>
            </div>

            <div className="stocks-grid">
                {stocks.map(stock => {
                    const isInPortfolio = portfolio.some(item => item.id === stock.id);

                    return (
                        <div key={stock.id} className="stock-card">
                            <div className="stock-card-header">
                                <div className="stock-symbol">{stock.symbol}</div>
                                <div className="stock-name">{stock.name}</div>
                            </div>

                            <div className="stock-details">
                                <div className="stock-price">
                                    <span className="label">Current Price:</span>
                                    <span className="value">${stock.price.toLocaleString()}</span>
                                </div>

                                <div className="stock-sector">
                                    <span className="label">Sector:</span>
                                    <span className="value">{stock.sector}</span>
                                </div>

                                <div className="stock-change">
                                    <span className="label">Today's Change:</span>
                                    <span className={`value ${stock.change.includes('+') ? 'positive' : 'negative'}`}>
                    {stock.change}
                  </span>
                                </div>

                                <div className="stock-risk">
                                    <span className="label">Risk Level:</span>
                                    <span className={`risk-badge risk-${stock.risk.toLowerCase()}`}>
                    {stock.risk}
                  </span>
                                </div>
                            </div>

                            <div className="stock-actions">
                                <button
                                    className={`btn-add-portfolio ${isInPortfolio ? 'added' : ''}`}
                                    onClick={() => addToPortfolio(stock)}
                                    disabled={isInPortfolio}
                                >
                                    {isInPortfolio ? '✓ Added to Portfolio' : '+ Add to Portfolio'}
                                </button>

                                {isInPortfolio && (
                                    <div className="portfolio-count">
                                        In portfolio: {portfolio.find(item => item.id === stock.id)?.quantity || 1}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
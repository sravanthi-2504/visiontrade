// src/components/PortfolioPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from './portfolio-context';

const PortfolioPage = () => {
    const {
        portfolio,
        removeFromPortfolio,
        updateQuantity,
        totalValue,
        totalInvested,
        totalProfitLoss,
        totalProfitLossPercentage,
        portfolioCount
    } = usePortfolio();

    if (portfolioCount === 0) {
        return (
            <div className="portfolio-page">
                <div className="empty-portfolio">
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h2>Your Portfolio is Empty</h2>
                        <p>Start building your portfolio by adding stocks from the Dashboard</p>
                        <Link to="/dashboard" className="btn-primary">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="portfolio-page">
            <div className="portfolio-header">
                <h1>My Portfolio</h1>
                <p className="subtitle">Tracking your virtual investments</p>
            </div>

            <div className="portfolio-stats">
                <div className="stat-card">
                    <h3>Total Value</h3>
                    <div className="stat-value">${totalValue.toLocaleString()}</div>
                </div>

                <div className="stat-card">
                    <h3>Total Invested</h3>
                    <div className="stat-value">${totalInvested.toLocaleString()}</div>
                </div>

                <div className="stat-card">
                    <h3>Total P/L</h3>
                    <div className={`stat-value ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
                        ${Math.abs(totalProfitLoss).toLocaleString()} ({totalProfitLossPercentage}%)
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Holdings</h3>
                    <div className="stat-value">{portfolioCount}</div>
                </div>
            </div>

            <div className="holdings-section">
                <div className="section-header">
                    <h2>My Holdings</h2>
                    <Link to="/dashboard" className="btn-add-more">
                        + Add More Stocks
                    </Link>
                </div>

                <div className="holdings-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Sector</th>
                            <th>Quantity</th>
                            <th>Buy Price</th>
                            <th>Current Price</th>
                            <th>Total Value</th>
                            <th>P/L</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {portfolio.map(item => {
                            const totalValue = item.price * item.quantity;
                            const totalCost = item.buyPrice * item.quantity;
                            const profitLoss = totalValue - totalCost;
                            const profitLossPercent = ((profitLoss / totalCost) * 100).toFixed(1);

                            return (
                                <tr key={item.id}>
                                    <td>
                                        <div className="stock-info">
                                            <strong>{item.symbol}</strong>
                                            <small>{item.name}</small>
                                        </div>
                                    </td>
                                    <td>{item.sector}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="quantity-input"
                                        />
                                    </td>
                                    <td>${item.buyPrice.toFixed(2)}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>${totalValue.toFixed(2)}</td>
                                    <td className={profitLoss >= 0 ? 'positive' : 'negative'}>
                                        ${profitLoss.toFixed(2)} ({profitLossPercent}%)
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => removeFromPortfolio(item.id)}
                                            className="btn-remove"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;
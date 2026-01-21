import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/stock-analysis.css'; // You'll create this CSS

const StockAnalysis = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch detailed stock data based on symbol
        fetchStockAnalysisData(symbol);
    }, [symbol]);

    const fetchStockAnalysisData = async (symbol) => {
        try {
            // API call to backend for detailed analysis
            const response = await fetch(`http://localhost:5000/api/stocks/analysis/${symbol}`);
            const data = await response.json();
            setStockData(data);
        } catch (error) {
            console.error('Error fetching analysis data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading analysis...</div>;
    if (!stockData) return <div className="error">No data found</div>;

    return (
        <div className="stock-analysis-container">
            {/* Header */}
            <div className="analysis-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1>{stockData.companyName} ({stockData.symbol})</h1>
                <p className="current-price">Current Price: ${stockData.price}</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>P/E Ratio</h3>
                    <p className="metric-value">{stockData.peRatio}</p>
                </div>
                <div className="metric-card">
                    <h3>ROE %</h3>
                    <p className="metric-value">{stockData.roe}%</p>
                </div>
                <div className="metric-card">
                    <h3>Growth Potential</h3>
                    <p className="metric-value">{stockData.growthPotential}/10</p>
                </div>
                <div className="metric-card">
                    <h3>Investment Score</h3>
                    <p className="metric-value">{stockData.investmentScore}/100</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                <div className="chart-card">
                    <h2>Historical Performance</h2>
                    <div className="chart-placeholder">
                        {/* Replace with actual chart component */}
                        <p>Historical chart for {symbol} will appear here</p>
                        <div className="mock-chart historical">
                            {/* Mock chart bars */}
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="bar" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="chart-card">
                    <h2>AI Prediction (1 Year)</h2>
                    <div className="chart-placeholder">
                        {/* Replace with actual chart component */}
                        <p>AI prediction chart for {symbol} will appear here</p>
                        <div className="mock-chart prediction">
                            {/* Mock prediction line */}
                            <div className="prediction-line"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="additional-info">
                <div className="info-section">
                    <h3>Recommendation</h3>
                    <p className={`recommendation ${stockData.recommendation.toLowerCase()}`}>
                        {stockData.recommendation}
                    </p>
                </div>
                <div className="info-section">
                    <h3>Risk Level</h3>
                    <p className={`risk-level ${stockData.riskLevel.toLowerCase()}`}>
                        {stockData.riskLevel}
                    </p>
                </div>
                <div className="info-section">
                    <h3>Sector</h3>
                    <p>{stockData.sector}</p>
                </div>
            </div>
        </div>
    );
};

export default StockAnalysis;
// src/data/indianStocksData.js
export const INDIAN_STOCKS_3500 = Array.from({ length: 3500 }, (_, index) => {
    // Real Indian stock symbols
    const baseSymbols = [
        'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
        'BHARTIARTL', 'KOTAKBANK', 'LT', 'HCLTECH', 'AXISBANK', 'MARUTI', 'ASIANPAINT',
        'WIPRO', 'ONGC', 'SUNPHARMA', 'NTPC', 'POWERGRID', 'ULTRACEMCO', 'TITAN',
        'BAJFINANCE', 'M&M', 'TATAMOTORS', 'ADANIPORTS', 'HINDALCO', 'JSWSTEEL',
        'TATASTEEL', 'VEDANTA', 'GRASIM', 'DIVISLAB', 'DRREDDY', 'BRITANNIA', 'EICHERMOT',
        'HDFC', 'HDFCLIFE', 'HEROMOTOCO', 'HINDPETRO', 'IOC', 'BPCL', 'COALINDIA',
        'INDUSINDBK', 'TECHM', 'SHREECEM', 'UPL', 'BAJAJFINSV', 'BAJAJ-AUTO'
    ];

    const sectors = [
        'Automobile', 'Banking', 'IT', 'Pharmaceuticals', 'Energy', 'FMCG',
        'Metals', 'Telecom', 'Real Estate', 'Infrastructure', 'Cement',
        'Chemicals', 'Textiles', 'Finance', 'Insurance', 'Media', 'Retail'
    ];

    const marketCaps = ['LARGE CAP', 'MID CAP', 'SMALL CAP'];
    const recommendations = ['Strong Buy', 'Buy', 'Hold', 'Sell'];
    const riskLevels = ['Low', 'Medium', 'High'];

    const baseSymbol = baseSymbols[index % baseSymbols.length];
    const sector = sectors[index % sectors.length];
    const marketCap = marketCaps[index % marketCaps.length];
    const price = (50 + Math.random() * 9950).toFixed(2);
    const change = (Math.random() * 200 - 100).toFixed(2);
    const changePercent = (parseFloat(change) / parseFloat(price) * 100).toFixed(2);

    return {
        id: `stock_${index}`,
        symbol: index < 50 ? baseSymbol : `${baseSymbol}${Math.floor(index / 100) + 1}`,
        name: `${baseSymbol} ${sector} Limited`,
        sector: sector,
        marketCap: `₹${(Math.random() * 10).toFixed(1)}L Cr ${marketCap}`,
        recommendation: recommendations[index % recommendations.length],
        riskLevel: riskLevels[index % riskLevels.length],
        currentPrice: `₹${price}`,
        change: change >= 0 ? `+₹${change}` : `-₹${Math.abs(change)}`,
        changePercent: `${changePercent}%`,
        rawPrice: parseFloat(price),
        rawChange: parseFloat(change),
        exchange: index % 2 === 0 ? 'NSE' : 'BSE',
        volume: Math.floor(Math.random() * 10000000),
        peRatio: (Math.random() * 50).toFixed(2)
    };
});

// Export helper functions
export const getAllIndianStocks = () => INDIAN_STOCKS_3500;
export const getStocksBySector = (sector) =>
    INDIAN_STOCKS_3500.filter(stock => stock.sector === sector);
export const searchStocks = (query) =>
    INDIAN_STOCKS_3500.filter(stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );
// src/data/3500Stocks.js
export const INDIAN_STOCKS_3500 = Array.from({ length: 3500 }, (_, i) => {
    // Real Indian symbols
    const symbols = [
        'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
        'BHARTIARTL', 'KOTAKBANK', 'LT', 'HCLTECH', 'AXISBANK', 'MARUTI', 'ASIANPAINT',
        'WIPRO', 'ONGC', 'SUNPHARMA', 'NTPC', 'POWERGRID', 'ULTRACEMCO', 'TITAN',
        'BAJFINANCE', 'M&M', 'TATAMOTORS', 'ADANIPORTS', 'HINDALCO', 'JSWSTEEL'
    ];

    const sectors = [
        'Banking', 'IT', 'Energy', 'FMCG', 'Automobile', 'Pharmaceuticals',
        'Telecom', 'Metals', 'Cement', 'Construction', 'Consumer Durables'
    ];

    const companyNames = [
        'Limited', 'Corporation', 'Industries', 'Enterprises', 'Holdings',
        'Technologies', 'Solutions', 'Ventures', 'International', 'Global'
    ];

    const baseSymbol = symbols[i % symbols.length];
    const sector = sectors[i % sectors.length];
    const companySuffix = companyNames[i % companyNames.length];

    const price = (50 + Math.random() * 4950).toFixed(2);
    const change = (Math.random() * 20 - 10).toFixed(2);
    const marketCap = (1000 + Math.random() * 99000).toFixed(0);

    return {
        id: `stock_${i + 1}`,
        symbol: i < 50 ? baseSymbol : `${baseSymbol}${Math.floor(i/100) + 1}`,
        name: `${baseSymbol} ${sector} ${companySuffix}`,
        sector: sector,
        marketCap: `₹${(marketCap / 100).toFixed(1)}L Cr`,
        marketCapRaw: parseFloat(marketCap),
        recommendation: ['Strong Buy', 'Buy', 'Hold', 'Sell'][i % 4],
        riskLevel: ['Low', 'Medium', 'High'][i % 3],
        price: `₹${price}`,
        change: change >= 0 ? `+₹${change}` : `-₹${Math.abs(change)}`,
        rawPrice: parseFloat(price),
        rawChange: parseFloat(change)
    };
});
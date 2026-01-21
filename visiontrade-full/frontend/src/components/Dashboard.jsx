import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_STOCKS = 3500;
const ITEMS_PER_PAGE = 25;
const CACHE_DURATION = 30000;

// ✅ REAL NSE/BSE LISTED INDIAN COMPANIES - DEFINED OUTSIDE COMPONENT
const REAL_INDIAN_STOCKS = [
    // Nifty 50 & Large Cap Stocks
    { symbol: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Limited', sector: 'IT' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Banking' },
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', sector: 'FMCG' },
    { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecom' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited', sector: 'Banking' },
    { symbol: 'LT', name: 'Larsen & Toubro Limited', sector: 'Infrastructure' },
    { symbol: 'HCLTECH', name: 'HCL Technologies Limited', sector: 'IT' },
    { symbol: 'AXISBANK', name: 'Axis Bank Limited', sector: 'Banking' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited', sector: 'Automobile' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Limited', sector: 'Paints' },
    { symbol: 'WIPRO', name: 'Wipro Limited', sector: 'IT' },
    { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Limited', sector: 'Energy' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Limited', sector: 'Pharmaceuticals' },
    { symbol: 'NTPC', name: 'NTPC Limited', sector: 'Power' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Limited', sector: 'Power' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Limited', sector: 'Cement' },
    { symbol: 'TITAN', name: 'Titan Company Limited', sector: 'Consumer Goods' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', sector: 'Finance' },
    { symbol: 'M&M', name: 'Mahindra & Mahindra Limited', sector: 'Automobile' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automobile' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports and SEZ Limited', sector: 'Infrastructure' },
    { symbol: 'HINDALCO', name: 'Hindalco Industries Limited', sector: 'Metals' },
    { symbol: 'JSWSTEEL', name: 'JSW Steel Limited', sector: 'Metals' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Limited', sector: 'Metals' },
    { symbol: 'VEDL', name: 'Vedanta Limited', sector: 'Metals' },
    { symbol: 'COALINDIA', name: 'Coal India Limited', sector: 'Mining' },
    { symbol: 'GRASIM', name: 'Grasim Industries Limited', sector: 'Diversified' },
    { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Limited', sector: 'Pharmaceuticals' },
    { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Limited', sector: 'Pharmaceuticals' },
    { symbol: 'CIPLA', name: 'Cipla Limited', sector: 'Pharmaceuticals' },
    { symbol: 'LUPIN', name: 'Lupin Limited', sector: 'Pharmaceuticals' },
    { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Limited', sector: 'Pharmaceuticals' },
    { symbol: 'BIOCON', name: 'Biocon Limited', sector: 'Pharmaceuticals' },
    { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
    { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
    { symbol: 'CADILAHC', name: 'Cadila Healthcare Limited', sector: 'Pharmaceuticals' },
    { symbol: 'ALKEM', name: 'Alkem Laboratories Limited', sector: 'Pharmaceuticals' },
    { symbol: 'IPCALAB', name: 'Ipca Laboratories Limited', sector: 'Pharmaceuticals' },
    { symbol: 'NATCOPHARM', name: 'Natco Pharma Limited', sector: 'Pharmaceuticals' },
    { symbol: 'LAURUSLABS', name: 'Laurus Labs Limited', sector: 'Pharmaceuticals' },
    { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Limited', sector: 'Healthcare' },
    { symbol: 'NESTLEIND', name: 'Nestle India Limited', sector: 'FMCG' },
    { symbol: 'BRITANNIA', name: 'Britannia Industries Limited', sector: 'FMCG' },
    { symbol: 'DABUR', name: 'Dabur India Limited', sector: 'FMCG' },
    { symbol: 'GODREJCP', name: 'Godrej Consumer Products Limited', sector: 'FMCG' },
    { symbol: 'MARICO', name: 'Marico Limited', sector: 'FMCG' },
    { symbol: 'COLPAL', name: 'Colgate-Palmolive India Limited', sector: 'FMCG' },
    { symbol: 'TATACONSUM', name: 'Tata Consumer Products Limited', sector: 'FMCG' },
    { symbol: 'INDIGO', name: 'InterGlobe Aviation Limited', sector: 'Aviation' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited', sector: 'Automobile' },
    { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Limited', sector: 'Automobile' },
    { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited', sector: 'Automobile' },
    { symbol: 'EICHERMOT', name: 'Eicher Motors Limited', sector: 'Automobile' },
    { symbol: 'TVSMOTOR', name: 'TVS Motor Company Limited', sector: 'Automobile' },
    { symbol: 'ASHOKLEY', name: 'Ashok Leyland Limited', sector: 'Automobile' },
    { symbol: 'MOTHERSUMI', name: 'Motherson Sumi Systems Limited', sector: 'Auto Components' },
    { symbol: 'BOSCHLTD', name: 'Bosch Limited', sector: 'Auto Components' },
    { symbol: 'EXIDEIND', name: 'Exide Industries Limited', sector: 'Auto Components' },
    { symbol: 'MRF', name: 'MRF Limited', sector: 'Auto Components' },
    { symbol: 'APOLLOTYRE', name: 'Apollo Tyres Limited', sector: 'Auto Components' },
    { symbol: 'CEATLTD', name: 'CEAT Limited', sector: 'Auto Components' },
    { symbol: 'BALKRISIND', name: 'Balkrishna Industries Limited', sector: 'Auto Components' },
    { symbol: 'BERGEPAINT', name: 'Berger Paints India Limited', sector: 'Paints' },
    { symbol: 'KANSAINER', name: 'Kansai Nerolac Paints Limited', sector: 'Paints' },
    { symbol: 'AKZOINDIA', name: 'Akzo Nobel India Limited', sector: 'Paints' },
    { symbol: 'SHREECEM', name: 'Shree Cement Limited', sector: 'Cement' },
    { symbol: 'AMBUJACEM', name: 'Ambuja Cements Limited', sector: 'Cement' },
    { symbol: 'ACC', name: 'ACC Limited', sector: 'Cement' },
    { symbol: 'RAMCOCEM', name: 'The Ramco Cements Limited', sector: 'Cement' },
    { symbol: 'JKCEMENT', name: 'JK Cement Limited', sector: 'Cement' },
    { symbol: 'IOC', name: 'Indian Oil Corporation Limited', sector: 'Energy' },
    { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited', sector: 'Energy' },
    { symbol: 'HINDPETRO', name: 'Hindustan Petroleum Corporation Limited', sector: 'Energy' },
    { symbol: 'GAIL', name: 'GAIL India Limited', sector: 'Energy' },
    { symbol: 'PETRONET', name: 'Petronet LNG Limited', sector: 'Energy' },
    { symbol: 'IGL', name: 'Indraprastha Gas Limited', sector: 'Energy' },
    { symbol: 'MGL', name: 'Mahanagar Gas Limited', sector: 'Energy' },
    { symbol: 'TATAPOWER', name: 'Tata Power Company Limited', sector: 'Power' },
    { symbol: 'ADANIPOWER', name: 'Adani Power Limited', sector: 'Power' },
    { symbol: 'ADANIGREEN', name: 'Adani Green Energy Limited', sector: 'Power' },
    { symbol: 'TORNTPOWER', name: 'Torrent Power Limited', sector: 'Power' },
    { symbol: 'JSWENERGY', name: 'JSW Energy Limited', sector: 'Power' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Limited', sector: 'Finance' },
    { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment Limited', sector: 'Finance' },
    { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial Services Limited', sector: 'Finance' },
    { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Limited', sector: 'Finance' },
    { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Limited', sector: 'Finance' },
    { symbol: 'MANAPPURAM', name: 'Manappuram Finance Limited', sector: 'Finance' },
    { symbol: 'RECLTD', name: 'REC Limited', sector: 'Finance' },
    { symbol: 'PFC', name: 'Power Finance Corporation Limited', sector: 'Finance' },
    { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Limited', sector: 'Insurance' },
    { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Limited', sector: 'Insurance' },
    { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Limited', sector: 'Insurance' },
    { symbol: 'ICICIGI', name: 'ICICI Lombard General Insurance Limited', sector: 'Insurance' },
    { symbol: 'BANDHANBNK', name: 'Bandhan Bank Limited', sector: 'Banking' },
    { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking' },
    { symbol: 'CANBK', name: 'Canara Bank', sector: 'Banking' },
    { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking' },
    { symbol: 'UNIONBANK', name: 'Union Bank of India', sector: 'Banking' },
    { symbol: 'INDIANB', name: 'Indian Bank', sector: 'Banking' },
    { symbol: 'FEDERALBNK', name: 'Federal Bank Limited', sector: 'Banking' },
    { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Limited', sector: 'Banking' },
    { symbol: 'RBLBANK', name: 'RBL Bank Limited', sector: 'Banking' },
    { symbol: 'INDUSINDBK', name: 'IndusInd Bank Limited', sector: 'Banking' },
    { symbol: 'YESBANK', name: 'Yes Bank Limited', sector: 'Banking' },
    { symbol: 'AUBANK', name: 'AU Small Finance Bank Limited', sector: 'Banking' },
    { symbol: 'EQUITASBNK', name: 'Equitas Small Finance Bank Limited', sector: 'Banking' },
    { symbol: 'UJJIVANSFB', name: 'Ujjivan Small Finance Bank Limited', sector: 'Banking' },
    { symbol: 'TECHM', name: 'Tech Mahindra Limited', sector: 'IT' },
    { symbol: 'MINDTREE', name: 'Mindtree Limited', sector: 'IT' },
    { symbol: 'MPHASIS', name: 'Mphasis Limited', sector: 'IT' },
    { symbol: 'COFORGE', name: 'Coforge Limited', sector: 'IT' },
    { symbol: 'LTI', name: 'L&T Infotech Limited', sector: 'IT' },
    { symbol: 'PERSISTENT', name: 'Persistent Systems Limited', sector: 'IT' },
    { symbol: 'LTTS', name: 'L&T Technology Services Limited', sector: 'IT' },
    { symbol: 'OFSS', name: 'Oracle Financial Services Software Limited', sector: 'IT' },
    { symbol: 'TATAELXSI', name: 'Tata Elxsi Limited', sector: 'IT' },
    { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises Limited', sector: 'Media' },
    { symbol: 'SUNTV', name: 'Sun TV Network Limited', sector: 'Media' },
    { symbol: 'PVR', name: 'PVR Limited', sector: 'Entertainment' },
    { symbol: 'DMART', name: 'Avenue Supermarts Limited', sector: 'Retail' },
    { symbol: 'TRENT', name: 'Trent Limited', sector: 'Retail' },
    { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks Limited', sector: 'FMCG' },
    { symbol: 'ZOMATO', name: 'Zomato Limited', sector: 'E-commerce' },
    { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Limited', sector: 'E-commerce' },
    { symbol: 'PAYTM', name: 'One 97 Communications Limited', sector: 'Fintech' },
    { symbol: 'NAUKRI', name: 'Info Edge India Limited', sector: 'E-commerce' },
    { symbol: 'DLF', name: 'DLF Limited', sector: 'Real Estate' },
    { symbol: 'PRESTIGE', name: 'Prestige Estates Projects Limited', sector: 'Real Estate' },
    { symbol: 'GODREJPROP', name: 'Godrej Properties Limited', sector: 'Real Estate' },
    { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Limited', sector: 'Real Estate' },
    { symbol: 'LODHA', name: 'Macrotech Developers Limited', sector: 'Real Estate' },
    { symbol: 'HAVELLS', name: 'Havells India Limited', sector: 'Consumer Goods' },
    { symbol: 'VOLTAS', name: 'Voltas Limited', sector: 'Consumer Goods' },
    { symbol: 'WHIRLPOOL', name: 'Whirlpool of India Limited', sector: 'Consumer Goods' },
    { symbol: 'CROMPTON', name: 'Crompton Greaves Consumer Electricals Limited', sector: 'Consumer Goods' },
    { symbol: 'VGUARD', name: 'V-Guard Industries Limited', sector: 'Consumer Goods' },
    { symbol: 'BATAINDIA', name: 'Bata India Limited', sector: 'Footwear' },
    { symbol: 'RELAXO', name: 'Relaxo Footwears Limited', sector: 'Footwear' },
    { symbol: 'PAGEIND', name: 'Page Industries Limited', sector: 'Textiles' },
    { symbol: 'RAYMOND', name: 'Raymond Limited', sector: 'Textiles' },
    { symbol: 'ARVIND', name: 'Arvind Limited', sector: 'Textiles' },
    { symbol: 'POLYCAB', name: 'Polycab India Limited', sector: 'Cables' },
    { symbol: 'KEI', name: 'KEI Industries Limited', sector: 'Cables' },
    { symbol: 'DIXON', name: 'Dixon Technologies India Limited', sector: 'Electronics' },
    { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism Corporation Limited', sector: 'Tourism' },
    { symbol: 'CONCOR', name: 'Container Corporation of India Limited', sector: 'Logistics' },
    { symbol: 'BEL', name: 'Bharat Electronics Limited', sector: 'Defense' },
    { symbol: 'HAL', name: 'Hindustan Aeronautics Limited', sector: 'Defense' },
    { symbol: 'BHEL', name: 'Bharat Heavy Electricals Limited', sector: 'Engineering' },
    { symbol: 'SIEMENS', name: 'Siemens Limited', sector: 'Engineering' },
    { symbol: 'ABB', name: 'ABB India Limited', sector: 'Engineering' },
    { symbol: 'CUMMINSIND', name: 'Cummins India Limited', sector: 'Engineering' },
    { symbol: 'THERMAX', name: 'Thermax Limited', sector: 'Engineering' },
    { symbol: 'SAIL', name: 'Steel Authority of India Limited', sector: 'Metals' },
    { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Limited', sector: 'Metals' },
    { symbol: 'HINDZINC', name: 'Hindustan Zinc Limited', sector: 'Metals' },
    { symbol: 'NATIONALUM', name: 'National Aluminium Company Limited', sector: 'Metals' },
    { symbol: 'NMDC', name: 'NMDC Limited', sector: 'Mining' },
    { symbol: 'MOIL', name: 'MOIL Limited', sector: 'Mining' },
    { symbol: 'GRAPHITE', name: 'Graphite India Limited', sector: 'Metals' },
    { symbol: 'HEG', name: 'HEG Limited', sector: 'Metals' },
    { symbol: 'SRF', name: 'SRF Limited', sector: 'Chemicals' },
    { symbol: 'UPL', name: 'UPL Limited', sector: 'Chemicals' },
    { symbol: 'PIDILITIND', name: 'Pidilite Industries Limited', sector: 'Chemicals' },
    { symbol: 'TATACHEM', name: 'Tata Chemicals Limited', sector: 'Chemicals' },
    { symbol: 'DEEPAKNTR', name: 'Deepak Nitrite Limited', sector: 'Chemicals' },
    { symbol: 'AARTI IND', name: 'Aarti Industries Limited', sector: 'Chemicals' },
    { symbol: 'GNFC', name: 'Gujarat Narmada Valley Fertilizers Limited', sector: 'Chemicals' },
    { symbol: 'COROMANDEL', name: 'Coromandel International Limited', sector: 'Chemicals' },
    { symbol: 'BALRAMCHIN', name: 'Balrampur Chini Mills Limited', sector: 'Sugar' },
    { symbol: 'TRIVENI', name: 'Triveni Engineering & Industries Limited', sector: 'Sugar' },
    { symbol: 'INDHOTEL', name: 'The Indian Hotels Company Limited', sector: 'Hotels' },
    { symbol: 'LEMONTREE', name: 'Lemon Tree Hotels Limited', sector: 'Hotels' },
    { symbol: 'CHALET', name: 'Chalet Hotels Limited', sector: 'Hotels' }
];


function Dashboard() {
    const isMounted = useRef(true);

    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSector, setSelectedSector] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [marketCapFilter, setMarketCapFilter] = useState('All');
    const [performanceFilter, setPerformanceFilter] = useState('All');

    const generateSimulatedPrice = (name = '') => {
        let base = 100;
        if (name.includes('Reliance')) base = 2500;
        else if (name.includes('Tata')) base = 3500;
        else if (name.includes('Bank')) base = 1200;
        else if (name.includes('Pharma')) base = 800;
        else if (name.includes('Infosys') || name.includes('IT')) base = 1500;

        base *= 0.8 + Math.random() * 0.4;
        const changePercent = (Math.random() * 10) - 5;
        const change = (base * changePercent) / 100;

        return {
            price: +(base + change).toFixed(2),
            changePercent: +changePercent.toFixed(2)
        };
    };

    const getMarketCap = price =>
        price > 2000 ? 'Large Cap' : price > 500 ? 'Mid Cap' : 'Small Cap';

    const getRisk = cap =>
        cap === 'Large Cap' ? 'Low' : cap === 'Mid Cap' ? 'Medium' : 'High';

    const getRecommendation = change =>
        change > 2 ? 'Buy' : change < -2 ? 'Sell' : 'Hold';

    useEffect(() => {
        isMounted.current = true;
        const temp = [];

        for (let i = 0; i < TOTAL_STOCKS; i++) {
            if (!isMounted.current) return;

            const baseStock = REAL_INDIAN_STOCKS[i % REAL_INDIAN_STOCKS.length];
            const priceData = generateSimulatedPrice(baseStock.name);
            const cap = getMarketCap(priceData.price);

            temp.push({
                id: i,
                ...baseStock,
                marketCap: cap,
                risk: getRisk(cap),
                recommendation: getRecommendation(priceData.changePercent),
                ...priceData
            });
        }

        setStocks(temp);
        setLoading(false);

        return () => (isMounted.current = false);
    }, []);

    const filteredStocks = stocks.filter(s =>
        (selectedSector === 'All' || s.sector === selectedSector) &&
        (marketCapFilter === 'All' || s.marketCap === marketCapFilter) &&
        (performanceFilter === 'All' ||
            (performanceFilter === 'Gainers' && s.changePercent > 0) ||
            (performanceFilter === 'Losers' && s.changePercent < 0)) &&
        (searchQuery === '' ||
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedStocks = filteredStocks.slice(start, start + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);
    const sectors = ['All', ...new Set(REAL_INDIAN_STOCKS.map(s => s.sector))];

    if (loading) {
        return <h2 style={{ textAlign: 'center' }}>Loading real Indian stocks…</h2>;
    }

    return (
        <div style={{ padding: 20, background: '#1a1a2e', minHeight: '100vh', color: '#fff' }}>
            <h1 style={{ textAlign: 'center' }}>📊 Indian Stocks Dashboard</h1>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <input placeholder="Search…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)}>
                    {sectors.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={marketCapFilter} onChange={e => setMarketCapFilter(e.target.value)}>
                    <option value="All">All Caps</option>
                    <option>Large Cap</option>
                    <option>Mid Cap</option>
                    <option>Small Cap</option>
                </select>
                <select value={performanceFilter} onChange={e => setPerformanceFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Gainers">Gainers</option>
                    <option value="Losers">Losers</option>
                </select>
            </div>

            {/* Table */}
            <table style={{ width: '100%', marginTop: 20 }}>
                <thead>
                <tr>
                    <th>Symbol</th><th>Company</th><th>Sector</th><th>Cap</th>
                    <th>Price</th><th>%</th><th>Risk</th><th>Reco</th>
                </tr>
                </thead>
                <tbody>
                {paginatedStocks.map(s => (
                    <tr key={s.id}>
                        <td>{s.symbol}</td>
                        <td>{s.name}</td>
                        <td>{s.sector}</td>
                        <td>{s.marketCap}</td>
                        <td>₹{s.price}</td>
                        <td>{s.changePercent}%</td>
                        <td>{s.risk}</td>
                        <td>{s.recommendation}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                <span style={{ margin: '0 10px' }}>{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
            </div>
        </div>
    );
}

export default Dashboard;

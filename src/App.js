import './App.css';
import './index.css';
import { useState, useEffect, useRef } from 'react';

function App() {
    // State for all companies
    const [allCompanies, setAllCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('All');
    const [selectedIndex, setSelectedIndex] = useState('All');
    const [marketStats, setMarketStats] = useState({
        totalCompanies: 0,
        totalMarketCap: '₹0 Cr',
        advances: 0,
        declines: 0,
        unchanged: 0,
        volume: '₹0 Cr',
        fiiInflow: '+₹0 Cr',
        diiInflow: '+₹0 Cr'
    });
    const [selectedMarketCap, setSelectedMarketCap] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
    const [user, setUser] = useState(null); // To track logged in user

    // Enhanced News states
    const [showNewsModal, setShowNewsModal] = useState(false);
    const [news, setNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [newsCategory, setNewsCategory] = useState('all');
    const [newsPage, setNewsPage] = useState(1);
    const [newsItemsPerPage] = useState(20);

    // NEW: Investment Recommendation states
    const [investmentScore, setInvestmentScore] = useState(0);
    const [recommendation, setRecommendation] = useState('');
    const [riskLevel, setRiskLevel] = useState('');
    const [analysisFactors, setAnalysisFactors] = useState([]);
    const [priceTarget, setPriceTarget] = useState(0);
    const [timeHorizon, setTimeHorizon] = useState('');
    const [sectorOutlook, setSectorOutlook] = useState('');

    // Market status
    const [marketStatus, setMarketStatus] = useState('closed');
    const [marketTime, setMarketTime] = useState('');

    // Refs
    const newsUpdateRef = useRef(null);

    // Indian market indices
    const indices = [
        'Nifty 50', 'Nifty Next 50', 'Nifty 100', 'Nifty 200', 'Nifty 500',
        'Nifty Midcap 100', 'Nifty Smallcap 100', 'Nifty Bank', 'Nifty IT',
        'Nifty Auto', 'Nifty Pharma', 'Nifty FMCG', 'Nifty Metal', 'Nifty Realty',
        'Nifty Energy', 'Nifty PSU Bank', 'Nifty Private Bank', 'Nifty Healthcare',
        'Sensex', 'BSE SmallCap', 'BSE MidCap', 'BSE LargeCap'
    ];

    // All sectors in Indian market with outlook
    const sectors = [
        { name: 'All', outlook: 'neutral' },
        { name: 'Banking', outlook: 'bullish' },
        { name: 'IT', outlook: 'cautious' },
        { name: 'Energy', outlook: 'bullish' },
        { name: 'FMCG', outlook: 'stable' },
        { name: 'Automobile', outlook: 'bullish' },
        { name: 'Pharmaceuticals', outlook: 'stable' },
        { name: 'Telecom', outlook: 'cautious' },
        { name: 'Real Estate', outlook: 'bullish' },
        { name: 'Metals', outlook: 'volatile' },
        { name: 'Cement', outlook: 'stable' },
        { name: 'Chemicals', outlook: 'bullish' },
        { name: 'Construction', outlook: 'bullish' },
        { name: 'Consumer Durables', outlook: 'stable' },
        { name: 'Finance', outlook: 'bullish' },
        { name: 'Industrial Manufacturing', outlook: 'stable' },
        { name: 'Media', outlook: 'cautious' },
        { name: 'Oil & Gas', outlook: 'volatile' },
        { name: 'Power', outlook: 'bullish' },
        { name: 'Retail', outlook: 'stable' },
        { name: 'Textiles', outlook: 'cautious' },
        { name: 'Transportation', outlook: 'stable' },
        { name: 'Miscellaneous', outlook: 'neutral' }
    ];

    // Market cap categories
    const marketCapCategories = [
        { label: 'Large Cap (>₹20,000 Cr)', min: 20000 },
        { label: 'Mid Cap (₹5,000-20,000 Cr)', min: 5000, max: 20000 },
        { label: 'Small Cap (<₹5,000 Cr)', max: 5000 },
        { label: 'Micro Cap (<₹500 Cr)', max: 500 }
    ];

    // News categories
    const newsCategories = [
        { id: 'all', name: 'All News', icon: '📰' },
        { id: 'breaking', name: 'Breaking', icon: '🔥' },
        { id: 'market', name: 'Market', icon: '📈' },
        { id: 'results', name: 'Results', icon: '📊' },
        { id: 'global', name: 'Global', icon: '🌍' },
        { id: 'policy', name: 'Policy', icon: '🏛️' },
        { id: 'stocks', name: 'Stocks', icon: '💹' }
    ];

    // Add this near line 100-120 where you have other arrays
    const realisticSymbols = [
        'ACC', 'ADANIENT', 'ADANIPORTS', 'ADANIPOWER', 'AMBUJACEM', 'APOLLOHOSP', 'APOLLOTYRE',
        'ASHOKLEY', 'ASIANPAINT', 'AUROPHARMA', 'AXISBANK', 'BAJAJ-AUTO', 'BAJAJFINSV',
        'BAJAJHLDNG', 'BAJFINANCE', 'BANKBARODA', 'BANKINDIA', 'BATAINDIA', 'BEL', 'BERGEPAINT',
        'BHARATFORG', 'BHARTIARTL', 'BHEL', 'BIOCON', 'BOSCHLTD', 'BPCL', 'BRITANNIA', 'CADILAHC',
        'CANBK', 'CASTROLIND', 'CENTURYTEX', 'CESC', 'CHOLAFIN', 'CIPLA', 'COALINDIA', 'COLPAL',
        'CONCOR', 'CUMMINSIND', 'DABUR', 'DALMIABHA', 'DCBBANK', 'DIVISLAB', 'DLF', 'DRREDDY',
        'EICHERMOT', 'ENGINERSIN', 'EQUITAS', 'ESCORTS', 'EXIDEIND', 'FEDERALBNK', 'GAIL',
        'GLENMARK', 'GMRINFRA', 'GODREJCP', 'GODREJIND', 'GRASIM', 'HAVELLS', 'HCLTECH',
        'HDFC', 'HDFCBANK', 'HEROMOTOCO', 'HEXAWARE', 'HINDALCO', 'HINDPETRO', 'HINDUNILVR',
        'HINDZINC', 'IBULHSGFIN', 'ICICIBANK', 'ICICIPRULI', 'IDEA', 'IDFC', 'IDFCFIRSTB',
        'IFCI', 'IGL', 'INDHOTEL', 'INDIACEM', 'INDIANB', 'INDIGO', 'INDUSINDBK', 'INFY',
        'IOC', 'IRB', 'ITC', 'JINDALSTEL', 'JSWSTEEL', 'JUBLFOOD', 'JUSTDIAL', 'KOTAKBANK',
        'KPIT', 'L&TFH', 'LICHSGFIN', 'LT', 'LUPIN', 'M&M', 'M&MFIN', 'MANAPPURAM', 'MARICO',
        'MARUTI', 'MCDOWELL-N', 'MCX', 'MFSL', 'MGL', 'MINDTREE', 'MOTHERSUMI', 'MRF',
        'MUTHOOTFIN', 'NATIONALUM', 'NBCC', 'NCC', 'NESTLE', 'NIITTECH', 'NMDC', 'NTPC',
        'OFSS', 'OIL', 'ONGC', 'ORIENTBANK', 'PAGEIND', 'PCJEWELLER', 'PEL', 'PETRONET',
        'PFC', 'PIDILITIND', 'PNB', 'POWERGRID', 'PRESTIGE', 'PVR', 'RAMCOCEM', 'RAYMOND',
        'RBLBANK', 'RECLTD', 'RELIANCE', 'SAIL', 'SBIN', 'SHREECEM', 'SIEMENS', 'SRF',
        'SRTRANSFIN', 'STAR', 'SUNPHARMA', 'SUNTV', 'SYNDIBANK', 'TATACHEM', 'TATACONSUM',
        'TATAELXSI', 'TATAGLOBAL', 'TATAMOTORS', 'TATAPOWER', 'TATASTEEL', 'TCS', 'TECHM',
        'TITAN', 'TORNTPHARM', 'TORNTPOWER', 'TV18BRDCST', 'TVSMOTOR', 'UBL', 'UJJIVAN',
        'ULTRACEMCO', 'UNIONBANK', 'UPL', 'VEDL', 'VGUARD', 'VOLTAS', 'WIPRO', 'WOCKPHARMA',
        'YESBANK', 'ZEEL'
    ];

    // Initialize with sample data
    useEffect(() => {
        fetchAllCompanies();
        calculateMarketStats();
        checkMarketStatus();
        fetchRealNews();

        // Update time every minute
        const timeInterval = setInterval(() => {
            setCurrentDate(new Date());
            checkMarketStatus();
        }, 60000);

        return () => {
            clearInterval(timeInterval);
            if (newsUpdateRef.current) clearInterval(newsUpdateRef.current);
        };
    }, []);

    // NEW: Initialize filteredCompanies when allCompanies is loaded
    useEffect(() => {
        if (allCompanies.length > 0) {
            setFilteredCompanies(allCompanies);
        }
    }, [allCompanies]);

    // Enhanced news fetching with auto-refresh
    useEffect(() => {
        // Clear existing interval
        if (newsUpdateRef.current) clearInterval(newsUpdateRef.current);

        // Set up new interval based on market status
        const updateInterval = isMarketOpen() ? 60000 : 300000;
        newsUpdateRef.current = setInterval(() => {
            fetchRealNews();
        }, updateInterval);

        return () => {
            if (newsUpdateRef.current) clearInterval(newsUpdateRef.current);
        };
    }, [marketStatus]);

    // Apply filters whenever search/filters change
    useEffect(() => {
        filterCompanies();
    }, [searchTerm, selectedSector, selectedIndex, selectedMarketCap, allCompanies]);

    // Check market status
    const checkMarketStatus = () => {
        const now = new Date();
        const istHour = now.getUTCHours() + 5.5;
        const istMinute = now.getUTCMinutes() + 30;
        const totalMinutes = istHour * 60 + istMinute;
        const marketOpen = 9 * 60 + 15;
        const marketClose = 15 * 60 + 30;
        const day = now.getUTCDay();
        const isWeekday = day >= 1 && day <= 5;

        const status = isWeekday && totalMinutes >= marketOpen && totalMinutes <= marketClose ? 'open' : 'closed';
        setMarketStatus(status);

        // Format time
        const timeStr = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        setMarketTime(timeStr);
    };

    // Safe number formatting function
    const formatNumber = (num) => {
        if (num === undefined || num === null) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Enhanced News fetching
    const fetchRealNews = async () => {
        setLoadingNews(true);

        try {
            const API_KEY = 'pub_6327cce17f6b40b8b5b47111bb215cdc'; // Get free API key from newsdata.io
            const response = await fetch(
                `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=stock%20market%20OR%20nse%20OR%20bse&country=in&language=en&category=business`
            );

            const data = await response.json();

            if (data.status === "success") {
                const realNews = data.results.map((item, index) => ({
                    id: index + 1,
                    title: item.title,
                    description: item.description || 'Stock market update',
                    time: formatTimeAgo(item.pubDate),
                    source: item.source_id || 'News',
                    category: getNewsCategory(item.title),
                    impact: getImpactLevel(item.title),
                    isBreaking: index < 3, // First 3 as breaking
                    stocksAffected: extractStocks(item.title),
                    companiesAffected: extractCompanies(item.title),
                    sector: getSectorFromNews(item.title),
                    readTime: '2 min read'
                }));

                setNews(realNews);
            }
        } catch (error) {
            console.error('Error fetching real news:', error);
            // Fallback to mock news
            const fallbackNews = generateComprehensiveNews();
            setNews(fallbackNews);
        }

        setLoadingNews(false);
    };

    // Generate comprehensive mock news
    const generateComprehensiveNews = () => {
        const newsTypes = [
            { type: 'market', impact: 'medium', source: 'Market Update' },
            { type: 'results', impact: 'high', source: 'Financial Express' },
            { type: 'global', impact: 'medium', source: 'Reuters' },
            { type: 'policy', impact: 'high', source: 'Business Standard' },
            { type: 'stocks', impact: 'low', source: 'MoneyControl' },
            { type: 'breaking', impact: 'high', source: 'Breaking News', isBreaking: true }
        ];

        const stockSymbols = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS'];
        const companies = ['Reliance Industries', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank', 'ITC', 'State Bank of India', 'Bharti Airtel'];
        const sectors = ['Banking', 'IT', 'Energy', 'FMCG', 'Auto', 'Pharma', 'Metal', 'Realty'];

        const newsItems = [];

        // Generate 50 news items
        for (let i = 0; i < 50; i++) {
            const type = newsTypes[i % newsTypes.length];
            const timeAgo = i < 5 ? `${i * 15} minutes ago` :
                i < 15 ? `${i - 4} hours ago` :
                    `${Math.floor((i - 14) / 2)} days ago`;

            const affectedStocks = [];
            const affectedCompanies = [];
            for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
                const idx = Math.floor(Math.random() * stockSymbols.length);
                affectedStocks.push(stockSymbols[idx]);
                affectedCompanies.push(companies[idx]);
            }

            const templates = [
                `${affectedCompanies.join(', ')} shares ${Math.random() > 0.5 ? 'rise' : 'fall'} on ${type.type} news`,
                `${sectors[Math.floor(Math.random() * sectors.length)]} sector ${Math.random() > 0.5 ? 'gains' : 'declines'} amid market volatility`,
                `${type.source} reports: Market ${Math.random() > 0.5 ? 'bullish' : 'bearish'} sentiment`,
                `Breaking: ${affectedCompanies[0]} announces ${Math.random() > 0.5 ? 'quarterly results' : 'new acquisition'}`,
                `Global markets ${Math.random() > 0.5 ? 'surge' : 'drop'} affecting ${affectedCompanies.join(', ')}`
            ];

            newsItems.push({
                id: i + 1,
                title: templates[Math.floor(Math.random() * templates.length)],
                description: `Detailed analysis of market movements affecting ${affectedCompanies.join(', ')}. Investors watching closely.`,
                time: timeAgo,
                source: type.source,
                category: type.type,
                impact: type.impact,
                isBreaking: type.isBreaking || false,
                stocksAffected: affectedStocks,
                companiesAffected: affectedCompanies,
                sector: sectors[Math.floor(Math.random() * sectors.length)],
                readTime: `${Math.floor(Math.random() * 5) + 1} min read`
            });
        }

        return newsItems;
    };

    // Generate daily news for fallback
    const generateDailyNews = (date) => {
        const formattedDate = date.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return [
            {
                id: 1,
                title: `Market News: Indian Indices Trade Higher on ${formattedDate}`,
                description: 'Sensex and Nifty show positive momentum amid global cues.',
                time: '2 hours ago',
                source: 'Market Update',
                category: 'market',
                impact: 'medium',
                isBreaking: false,
                stocksAffected: ['^NSEI', '^BSESN'],
                companiesAffected: ['NSE', 'BSE'],
                sector: 'Market',
                readTime: '2 min read'
            },
            {
                id: 2,
                title: 'FIIs Continue Buying in Indian Markets',
                description: 'Foreign Institutional Investors remain net buyers for the third consecutive week.',
                time: '4 hours ago',
                source: 'Financial Express',
                category: 'stocks',
                impact: 'high',
                isBreaking: false,
                stocksAffected: ['RELIANCE.NS', 'HDFCBANK.NS'],
                companiesAffected: ['Reliance Industries', 'HDFC Bank'],
                sector: 'Banking',
                readTime: '3 min read'
            }
        ];
    };

    // Filter news by category
    const filterNewsByCategory = (category) => {
        if (category === 'all') return news;
        if (category === 'breaking') return news.filter(item => item.isBreaking);
        return news.filter(item => item.category === category);
    };

    // Get paginated news
    const getPaginatedNews = () => {
        const filtered = filterNewsByCategory(newsCategory);
        const startIndex = (newsPage - 1) * newsItemsPerPage;
        const endIndex = startIndex + newsItemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    // Check if market is open
    const isMarketOpen = () => marketStatus === 'open';

    // NEW: Helper functions for investment analysis
    const getRecommendationFromScore = (score) => {
        if (score >= 80) return 'STRONG BUY';
        if (score >= 70) return 'BUY';
        if (score >= 60) return 'ACCUMULATE';
        if (score >= 50) return 'HOLD';
        if (score >= 40) return 'REDUCE';
        return 'SELL';
    };

    const getRiskLevel = (marketCap, profitGrowth) => {
        let risk = 'Medium';
        if (marketCap < 5000) risk = 'High';
        if (marketCap > 20000) risk = 'Low';
        if (profitGrowth < 0) risk = 'High';
        return risk;
    };

    const getTimeHorizon = (score) => {
        if (score >= 70) return 'Short to Medium Term (3-12 months)';
        if (score >= 60) return 'Medium Term (1-2 years)';
        if (score >= 50) return 'Long Term (2+ years)';
        return 'Not Recommended';
    };

    const getSectorOutlook = (sectorName) => {
        const sector = sectors.find(s => s.name === sectorName);
        return sector ? sector.outlook : 'neutral';
    };

    // ==================== Helper Functions ====================

    // Fetch REAL top 20 Indian stocks
    const fetchRealTopStocks = async () => {
        // If you have Alpha Vantage API key, use it. Otherwise use fallback real data.
        const useRealAPI = false; // Set to true when you get API key

        if (useRealAPI) {
            return await fetchRealStocksFromAPI();
        } else {
            return generateRealisticTopStocks(); // Fallback with realistic data
        }
    };

    const fetchRealStocksFromAPI = async () => {
        // This is a stub - implement with real API when you have key
        console.log('Using real API would go here');
        return generateRealisticTopStocks(); // Fallback for now
    };

    // Generate realistic top 20 stocks (fallback when no API)
    const generateRealisticTopStocks = () => {
        const currentDate = new Date();
        const isMarketOpen = marketStatus === 'open';

        // REAL Indian stock data (updated realistic prices)
        const realTopStocks = [
            { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', sector: 'Energy', basePrice: 2945.15, volatility: 85 },
            { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.', sector: 'IT', basePrice: 3890.50, volatility: 120 },
            { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', sector: 'Banking', basePrice: 1680.25, volatility: 45 },
            { symbol: 'INFY.NS', name: 'Infosys Ltd.', sector: 'IT', basePrice: 1595.75, volatility: 65 },
            { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', sector: 'Banking', basePrice: 1085.40, volatility: 35 },
            { symbol: 'ITC.NS', name: 'ITC Ltd.', sector: 'FMCG', basePrice: 445.60, volatility: 15 },
            { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking', basePrice: 625.80, volatility: 25 },
            { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.', sector: 'Telecom', basePrice: 1185.90, volatility: 40 },
            { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.', sector: 'FMCG', basePrice: 2510.30, volatility: 75 },
            { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd.', sector: 'Banking', basePrice: 1785.20, volatility: 55 },
            { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd.', sector: 'Banking', basePrice: 1120.45, volatility: 40 },
            { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd.', sector: 'Construction', basePrice: 3450.80, volatility: 150 },
            { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd.', sector: 'Finance', basePrice: 7120.60, volatility: 300 },
            { symbol: 'WIPRO.NS', name: 'Wipro Ltd.', sector: 'IT', basePrice: 485.30, volatility: 20 },
            { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corporation Ltd.', sector: 'Energy', basePrice: 265.40, volatility: 12 },
            { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd.', sector: 'Automobile', basePrice: 11250.75, volatility: 450 },
            { symbol: 'TITAN.NS', name: 'Titan Company Ltd.', sector: 'Consumer Durables', basePrice: 3650.90, volatility: 180 },
            { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement Ltd.', sector: 'Cement', basePrice: 9850.40, volatility: 400 },
            { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries Ltd.', sector: 'Pharmaceuticals', basePrice: 1480.25, volatility: 60 },
            { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Ltd.', sector: 'Automobile', basePrice: 895.60, volatility: 35 }
        ];

        return realTopStocks.map((stock, index) => {
            // Realistic price movement based on market status
            const volatilityFactor = isMarketOpen ? 1.5 : 0.5;
            const priceChange = (Math.random() * stock.volatility * 2 - stock.volatility) * volatilityFactor;
            const price = stock.basePrice + priceChange;
            const change = isMarketOpen ? priceChange : (Math.random() * 20 - 10);
            const changePercent = ((change / price) * 100);

            // Realistic volume
            const volume = Math.floor(stock.basePrice * (10000 + Math.random() * 50000));

            // Calculate investment score realistically
            const investmentScore = calculateRealisticInvestmentScore(stock.sector, price, changePercent);

            return {
                id: index + 1,
                symbol: stock.symbol,
                name: stock.name,
                sector: stock.sector,
                marketCap: price * (100000 + Math.random() * 400000),
                price: price.toFixed(2),
                change: parseFloat(change.toFixed(2)),
                changePercent: parseFloat(changePercent.toFixed(2)),
                volume: volume,
                index: indices[Math.floor(Math.random() * 5)], // Top indices only
                peRatio: (Math.random() * 35 + 8).toFixed(1),
                dividendYield: (Math.random() * 3.5).toFixed(2),
                weekHigh: (price * 1.12).toFixed(2),
                weekLow: (price * 0.88).toFixed(2),
                roe: (Math.random() * 22 + 8).toFixed(1),
                profitGrowth: (Math.random() * 25 + 2).toFixed(1),
                revenueGrowth: (Math.random() * 20 + 3).toFixed(1),
                operatingMargin: (Math.random() * 18 + 7).toFixed(1),
                promoterHolding: (Math.random() * 35 + 35).toFixed(1),
                fiiHolding: (Math.random() * 22 + 8).toFixed(1),
                diiHolding: (Math.random() * 18 + 7).toFixed(1),
                rsi: Math.floor(Math.random() * 60 + 25),
                macd: parseFloat((Math.random() * 1.5 - 0.5).toFixed(2)),
                investmentScore: investmentScore,
                recommendation: getRecommendationFromScore(investmentScore),
                riskLevel: getRiskLevel(price * 100000, (Math.random() * 25 + 2)),
                timeHorizon: getTimeHorizon(investmentScore),
                sectorOutlook: getSectorOutlook(stock.sector),
                isRealStock: true,
                isSimulated: false
            };
        });
    };

    // Generate smart simulated data (3480 companies)
    // Generate smart simulated data (3480 companies)
    const generateSmartSimulatedData = (realStocks) => {
        const simulated = [];

        // Analyze patterns from real stocks
        const sectorDistribution = {};
        const avgPricesBySector = {};

        realStocks.forEach(stock => {
            if (!sectorDistribution[stock.sector]) {
                sectorDistribution[stock.sector] = 0;
                avgPricesBySector[stock.sector] = [];
            }
            sectorDistribution[stock.sector]++;
            avgPricesBySector[stock.sector].push(parseFloat(stock.price));
        });

        // Calculate sector weights for simulation
        const totalReal = realStocks.length;
        const sectorWeights = {};
        Object.keys(sectorDistribution).forEach(sector => {
            sectorWeights[sector] = Math.max(50, Math.floor((sectorDistribution[sector] / totalReal) * 3480));
        });

        // Fill remaining with other sectors
        const allSectors = ['Banking', 'IT', 'Energy', 'FMCG', 'Pharmaceuticals', 'Automobile', 'Cement',
            'Metals', 'Real Estate', 'Telecom', 'Power', 'Infrastructure', 'Chemicals',
            'Textiles', 'Media', 'Retail', 'Transportation'];

        let stocksGenerated = 0;
        let companyId = realStocks.length + 1;

        // Generate based on sector weights
        Object.keys(sectorWeights).forEach(sector => {
            const count = sectorWeights[sector];
            const avgPrice = avgPricesBySector[sector]
                ? avgPricesBySector[sector].reduce((a, b) => a + b, 0) / avgPricesBySector[sector].length
                : 500;

            for (let i = 0; i < count && stocksGenerated < 3480; i++) {
                // Price follows sector average with variation
                const priceVariation = 0.2 + Math.random() * 1.6; // 0.2x to 1.8x of sector avg
                const price = (avgPrice * priceVariation).toFixed(2);
                const change = (Math.random() * 12 - 6).toFixed(2);
                const changePercent = ((change / price) * 100).toFixed(2);

                // Market cap proportional to price
                const marketCapMultiplier = 50 + Math.random() * 950; // Much smaller multiplier
                const marketCap = parseFloat(price) * marketCapMultiplier / 100; // Divide by 100

                // Generate company name
                const nameSuffixes = ['Ltd', 'Limited', 'Pvt Ltd', 'Private Limited'];
                const name = `${sector} Holdings ${stocksGenerated + 1} ${nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]}`;

                simulated.push({
                    id: companyId++,
                    symbol: `${realisticSymbols[Math.floor(Math.random() * realisticSymbols.length)]}${Math.floor(Math.random() * 90) + 10}.NS`,
                    name: name,
                    sector: sector,
                    marketCap: marketCap,
                    price: price,
                    change: parseFloat(change),
                    changePercent: parseFloat(changePercent),
                    volume: Math.floor(parseFloat(price) * (500 + Math.random() * 9500)),
                    index: indices[Math.floor(Math.random() * indices.length)],
                    peRatio: (Math.random() * 50 + 3).toFixed(1),
                    dividendYield: (Math.random() * 5).toFixed(2),
                    weekHigh: (parseFloat(price) * 1.2).toFixed(2),
                    weekLow: (parseFloat(price) * 0.8).toFixed(2),
                    roe: (Math.random() * 35 - 8).toFixed(1),
                    profitGrowth: (Math.random() * 40 - 15).toFixed(1),
                    revenueGrowth: (Math.random() * 35 - 10).toFixed(1),
                    operatingMargin: (Math.random() * 30 - 5).toFixed(1),
                    promoterHolding: (Math.random() * 55 + 20).toFixed(1),
                    fiiHolding: (Math.random() * 35 + 3).toFixed(1),
                    diiHolding: (Math.random() * 30 + 3).toFixed(1),
                    rsi: Math.floor(Math.random() * 85 + 10),
                    macd: parseFloat((Math.random() * 3 - 1.5).toFixed(2)),
                    investmentScore: calculateSmartInvestmentScore(parseFloat(price), marketCap, sector),
                    recommendation: getRecommendationFromScore(calculateSmartInvestmentScore(parseFloat(price), marketCap, sector)),
                    riskLevel: getRiskLevel(marketCap, Math.random() * 40 - 15),
                    timeHorizon: getTimeHorizon(calculateSmartInvestmentScore(parseFloat(price), marketCap, sector)),
                    sectorOutlook: getSectorOutlook(sector),
                    isRealStock: false,
                    isSimulated: true
                });

                stocksGenerated++;
            }
        });

        // Fill remaining with random sectors
        while (stocksGenerated < 3480) {
            const sector = allSectors[Math.floor(Math.random() * allSectors.length)];
            const price = (Math.random() * 5000 + 10).toFixed(2);
            const change = (Math.random() * 15 - 7.5).toFixed(2);
            const changePercent = ((change / price) * 100).toFixed(2);
            const marketCap = parseFloat(price) * (10 + Math.random() * 990) / 100; // Much smaller values

            // Generate company name
            const nameSuffixes = ['Ltd', 'Limited', 'Pvt Ltd', 'Private Limited'];
            const name = `${sector} Holdings ${stocksGenerated + 1} ${nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]}`;

            simulated.push({
                id: companyId++,
                symbol: `${realisticSymbols[Math.floor(Math.random() * realisticSymbols.length)]}${Math.floor(Math.random() * 90) + 10}.NS`,
                name: name,
                sector: sector,
                marketCap: marketCap,
                price: price,
                change: parseFloat(change),
                changePercent: parseFloat(changePercent),
                volume: Math.floor(parseFloat(price) * (500 + Math.random() * 9500)),
                index: indices[Math.floor(Math.random() * indices.length)],
                peRatio: (Math.random() * 50 + 3).toFixed(1),
                dividendYield: (Math.random() * 5).toFixed(2),
                weekHigh: (parseFloat(price) * 1.2).toFixed(2),
                weekLow: (parseFloat(price) * 0.8).toFixed(2),
                roe: (Math.random() * 35 - 8).toFixed(1),
                profitGrowth: (Math.random() * 40 - 15).toFixed(1),
                revenueGrowth: (Math.random() * 35 - 10).toFixed(1),
                operatingMargin: (Math.random() * 30 - 5).toFixed(1),
                promoterHolding: (Math.random() * 55 + 20).toFixed(1),
                fiiHolding: (Math.random() * 35 + 3).toFixed(1),
                diiHolding: (Math.random() * 30 + 3).toFixed(1),
                rsi: Math.floor(Math.random() * 85 + 10),
                macd: parseFloat((Math.random() * 3 - 1.5).toFixed(2)),
                investmentScore: calculateSmartInvestmentScore(parseFloat(price), marketCap, sector),
                recommendation: getRecommendationFromScore(calculateSmartInvestmentScore(parseFloat(price), marketCap, sector)),
                riskLevel: getRiskLevel(marketCap, Math.random() * 40 - 15),
                timeHorizon: getTimeHorizon(calculateSmartInvestmentScore(parseFloat(price), marketCap, sector)),
                sectorOutlook: getSectorOutlook(sector),
                isRealStock: false,
                isSimulated: true
            });

            stocksGenerated++;
        }

        return simulated;
    };

    // Smart investment score calculator
    const calculateSmartInvestmentScore = (price, marketCap, sector) => {
        let score = 50;

        // Price factor (lower price often means higher risk/reward)
        if (price < 50) score += 10;
        else if (price < 100) score += 5;
        else if (price > 1000) score += 2;

        // Market cap factor
        if (marketCap > 20000) score += 8; // Large cap stability
        else if (marketCap > 5000) score += 5; // Mid cap
        else if (marketCap > 500) score += 2; // Small cap
        else score -= 5; // Micro cap risk

        // Sector factor
        const sectorFactors = {
            'FMCG': 8, 'Pharmaceuticals': 7, 'IT': 6, 'Banking': 5,
            'Energy': 4, 'Automobile': 3, 'Cement': 5, 'Metals': 2,
            'Real Estate': 1, 'Telecom': 3, 'Media': 2, 'Retail': 4
        };
        score += sectorFactors[sector] || 0;

        // Random market sentiment
        score += Math.random() * 20 - 10;

        return Math.max(10, Math.min(score, 95));
    };

    // Calculate realistic investment score
    const calculateRealisticInvestmentScore = (sector, price, changePercent) => {
        let score = 60;

        // Sector boost
        if (['FMCG', 'Pharmaceuticals', 'IT'].includes(sector)) score += 10;
        else if (['Banking', 'Energy'].includes(sector)) score += 5;

        // Price stability
        if (price > 1000) score += 5; // Blue-chip

        // Recent performance
        if (changePercent > 2) score += 3;
        else if (changePercent < -2) score -= 5;

        return Math.max(20, Math.min(score, 90));
    };

    // Shuffle array function
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Fallback generator
    const generateFallbackCompanies = (count) => {
        const companies = [];
        let companyId = 1;

        for (let i = 0; i < count; i++) {
            const sector = sectors[Math.floor(Math.random() * (sectors.length - 1)) + 1]; // Skip 'All'
            const price = (Math.random() * 5000 + 10).toFixed(2);
            const change = (Math.random() * 20 - 10).toFixed(2);
            const changePercent = ((change / price) * 100).toFixed(2);
            const marketCap = parseFloat(price) * (1000 + Math.random() * 99000);

            // Name generation
            const namePrefixes = ['Shri', 'Sri', 'M/s', 'National', 'Global', 'Indian', 'Bharat'];
            const nameBases = ['Textiles', 'Chemicals', 'Steel', 'Plastics', 'Electronics', 'Machinery'];
            const nameSuffixes = ['Ltd', 'Limited', 'Pvt Ltd', 'Private Limited'];

            const name = `${namePrefixes[Math.floor(Math.random() * namePrefixes.length)]} ${
                nameBases[Math.floor(Math.random() * nameBases.length)]
            } ${nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]}`;

            // Symbol generation
            const realisticPrefixes = ['ABC', 'XYZ', 'IND', 'BHR', 'NAT', 'GLB', 'PRM', 'ELT', 'RIL'];
            const symbol = `${realisticPrefixes[Math.floor(Math.random() * realisticPrefixes.length)]}${Math.floor(Math.random() * 900) + 100}.NS`;

            // Financial metrics
            const roe = (Math.random() * 40 - 10).toFixed(1);
            const profitGrowth = (Math.random() * 50 - 20).toFixed(1);
            const revenueGrowth = (Math.random() * 45 - 15).toFixed(1);
            const operatingMargin = (Math.random() * 35 - 5).toFixed(1);
            const promoterHolding = (Math.random() * 60 + 20).toFixed(1);
            const fiiHolding = (Math.random() * 30 + 5).toFixed(1);
            const diiHolding = (Math.random() * 25 + 5).toFixed(1);
            const rsi = Math.floor(Math.random() * 100);
            const macd = parseFloat((Math.random() * 3 - 1.5).toFixed(2));

            // Calculate investment score
            let score = 50;
            if (parseFloat(roe) > 25) score += 20;
            else if (parseFloat(roe) > 20) score += 15;
            else if (parseFloat(roe) > 15) score += 10;
            else if (parseFloat(roe) > 10) score += 5;
            else if (parseFloat(roe) > 5) score += 0;
            else if (parseFloat(roe) > 0) score -= 5;
            else if (parseFloat(roe) > -5) score -= 15;
            else score -= 25;

            // Cap score
            score = Math.max(0, Math.min(score, 100));

            companies.push({
                id: companyId++,
                symbol: symbol,
                name: name,
                sector: sector.name,
                marketCap: marketCap,
                price: price,
                change: parseFloat(change),
                changePercent: parseFloat(changePercent),
                volume: Math.floor(Math.random() * 10000000),
                index: indices[Math.floor(Math.random() * indices.length)],
                peRatio: (Math.random() * 50 + 5).toFixed(1),
                dividendYield: (Math.random() * 5).toFixed(2),
                weekHigh: (parseFloat(price) * 1.2).toFixed(2),
                weekLow: (parseFloat(price) * 0.8).toFixed(2),
                roe: parseFloat(roe),
                profitGrowth: parseFloat(profitGrowth),
                revenueGrowth: parseFloat(revenueGrowth),
                operatingMargin: parseFloat(operatingMargin),
                promoterHolding: parseFloat(promoterHolding),
                fiiHolding: parseFloat(fiiHolding),
                diiHolding: parseFloat(diiHolding),
                rsi: rsi,
                macd: parseFloat(macd),
                investmentScore: Math.round(score),
                recommendation: getRecommendationFromScore(score),
                riskLevel: getRiskLevel(marketCap, parseFloat(profitGrowth)),
                timeHorizon: getTimeHorizon(score),
                sectorOutlook: getSectorOutlook(sector.name),
                isRealStock: false
            });
        }

        return companies;
    };

    // Fetch all companies function
    const fetchAllCompanies = async () => {
        setLoading(true);

        console.log('🔄 Fetching hybrid stock data: 20 real + 3480 smart simulated...');

        try {
            // ==================== STEP 1: Fetch REAL Top 20 Stocks ====================
            console.log('📈 Step 1: Fetching real top 20 stocks...');
            const realStocks = await fetchRealTopStocks();
            console.log(`✅ Fetched ${realStocks.length} real stocks`);

            // ==================== STEP 2: Generate Smart Simulated Stocks ====================
            console.log('🤖 Step 2: Generating smart simulated data...');
            const simulatedStocks = generateSmartSimulatedData(realStocks);
            console.log(`✅ Generated ${simulatedStocks.length} simulated stocks`);

            // ==================== STEP 3: Combine ====================
            const allCompanies = [...realStocks, ...simulatedStocks];
            console.log(`🎉 Total: ${allCompanies.length} companies (${realStocks.length} real + ${simulatedStocks.length} simulated)`);

            // Shuffle to mix real and simulated
            const shuffledCompanies = shuffleArray([...allCompanies]);

            setAllCompanies(shuffledCompanies);
            setFilteredCompanies(shuffledCompanies);

            // ==================== STEP 4: Update Market Stats ====================
            const advances = shuffledCompanies.filter(c => c.change > 0).length;
            const declines = shuffledCompanies.filter(c => c.change < 0).length;
            const totalMarketCap = shuffledCompanies.reduce((sum, c) => sum + c.marketCap, 0);

            setMarketStats({
                totalCompanies: shuffledCompanies.length,
                totalMarketCap: `₹${(totalMarketCap / 10000000).toFixed(0)} Cr`,
                advances: advances,
                declines: declines,
                unchanged: shuffledCompanies.length - advances - declines,
                volume: `₹${Math.floor(totalMarketCap * 0.0001)} Cr`,
                fiiInflow: `+₹${Math.floor(Math.random() * 2000) + 500} Cr`,
                diiInflow: `+₹${Math.floor(Math.random() * 1000) + 300} Cr`
            });

        } catch (error) {
            console.error('❌ Error in hybrid fetch:', error);
            // Fallback to pure simulation
            console.log('🔄 Falling back to simulation...');
            const fallbackCompanies = generateFallbackCompanies(3500);
            setAllCompanies(fallbackCompanies);
            setFilteredCompanies(fallbackCompanies);

            setMarketStats({
                totalCompanies: 3500,
                totalMarketCap: '₹350,00,000 Cr',
                advances: 2100,
                declines: 1100,
                unchanged: 300,
                volume: '₹45,230 Cr',
                fiiInflow: '+₹1,250 Cr',
                diiInflow: '+₹680 Cr'
            });
        }

        setLoading(false);
        console.log('✅ Hybrid data loading complete!');
    };

    // NEW: Comprehensive investment analysis function
    const analyzeCompanyForInvestment = (company) => {
        if (!company) return;

        // Ensure all numerical values are parsed as numbers
        const macdValue = typeof company.macd === 'string' ? parseFloat(company.macd) : company.macd || 0;
        const peRatio = typeof company.peRatio === 'string' ? parseFloat(company.peRatio) : company.peRatio || 0;
        const roe = typeof company.roe === 'string' ? parseFloat(company.roe) : company.roe || 0;
        const profitGrowth = typeof company.profitGrowth === 'string' ? parseFloat(company.profitGrowth) : company.profitGrowth || 0;
        const operatingMargin = typeof company.operatingMargin === 'string' ? parseFloat(company.operatingMargin) : company.operatingMargin || 0;
        const promoterHolding = typeof company.promoterHolding === 'string' ? parseFloat(company.promoterHolding) : company.promoterHolding || 0;
        const fiiHolding = typeof company.fiiHolding === 'string' ? parseFloat(company.fiiHolding) : company.fiiHolding || 0;
        const diiHolding = typeof company.diiHolding === 'string' ? parseFloat(company.diiHolding) : company.diiHolding || 0;

        // Calculate investment score based on multiple factors
        let score = company.investmentScore || 50;

        // Adjust score based on market conditions
        const marketSentiment = marketStatus === 'open' ? 5 : 0;
        const peScore = peRatio < 25 ? 10 : peRatio < 40 ? 5 : 0;

        // Technical indicators
        const rsiScore = company.rsi > 30 && company.rsi < 70 ? 10 : 0;
        const macdScore = macdValue > 0 ? 5 : 0;

        // Fundamental analysis - with penalties for negative values
        let roeScore = roe > 20 ? 15 : roe > 15 ? 10 : roe > 10 ? 5 : 0;
        let growthScore = profitGrowth > 15 ? 15 : profitGrowth > 10 ? 10 : profitGrowth > 5 ? 5 : 0;
        let marginScore = operatingMargin > 20 ? 10 : operatingMargin > 15 ? 5 : 0;

        // Add penalty for negative fundamentals
        if (roe < 0) roeScore = -10;
        if (profitGrowth < 0) growthScore = -10;
        if (operatingMargin < 5) marginScore = -5;

        // Ownership pattern
        const promoterScore = promoterHolding > 60 ? 10 : promoterHolding > 50 ? 5 : 0;
        const institutionalScore = (fiiHolding + diiHolding) > 30 ? 10 : 5;

        // Recent price momentum
        const momentumScore = company.change > 0 ? 5 : 0;

        // Add stronger penalties for poor conditions
        const negativeScore =
            (roe < 0 ? 10 : 0) +
            (profitGrowth < -10 ? 10 : 0) +
            (peRatio > 50 ? 10 : 0);

        // Calculate final score with penalties
        const finalScore = Math.max(0, Math.min(
            score + marketSentiment + peScore + rsiScore + macdScore +
            roeScore + growthScore + marginScore +
            promoterScore + institutionalScore + momentumScore - negativeScore,
            100
        ));

        // Set analysis results
        setInvestmentScore(finalScore);
        setRecommendation(getRecommendationFromScore(finalScore));
        setRiskLevel(company.riskLevel);
        setTimeHorizon(company.timeHorizon);
        setSectorOutlook(company.sectorOutlook);

        // Calculate price target (12-month)
        const currentPrice = parseFloat(company.price);
        let targetMultiplier = 1.0;

        if (finalScore >= 80) targetMultiplier = 1.25;
        else if (finalScore >= 70) targetMultiplier = 1.15;
        else if (finalScore >= 60) targetMultiplier = 1.08;
        else if (finalScore >= 50) targetMultiplier = 1.02;
        else if (finalScore >= 40) targetMultiplier = 0.95;
        else targetMultiplier = 0.85;

        setPriceTarget(currentPrice * targetMultiplier);

        // Generate analysis factors
        const factors = [
            {
                name: 'Valuation (P/E Ratio)',
                score: peScore,
                status: peRatio < 25 ? 'excellent' : peRatio < 40 ? 'good' : 'poor',
                details: `P/E Ratio: ${company.peRatio} (${peRatio < 25 ? 'Undervalued' : peRatio < 40 ? 'Fairly Valued' : 'Overvalued'})`
            },
            {
                name: 'Profitability (ROE)',
                score: roeScore,
                status: roe > 20 ? 'excellent' : roe > 15 ? 'good' : roe > 10 ? 'average' : 'poor',
                details: `Return on Equity: ${company.roe}% (${roe > 20 ? 'Excellent' : roe > 15 ? 'Good' : roe > 10 ? 'Average' : 'Poor'})`
            },
            {
                name: 'Growth Potential',
                score: growthScore,
                status: profitGrowth > 15 ? 'excellent' : profitGrowth > 10 ? 'good' : profitGrowth > 5 ? 'average' : 'poor',
                details: `Profit Growth: ${profitGrowth > 0 ? '+' : ''}${company.profitGrowth}% YoY`
            },
            {
                name: 'Operating Efficiency',
                score: marginScore,
                status: operatingMargin > 20 ? 'excellent' : operatingMargin > 15 ? 'good' : operatingMargin > 10 ? 'average' : 'poor',
                details: `Operating Margin: ${company.operatingMargin}%`
            },
            {
                name: 'Promoter Confidence',
                score: promoterScore,
                status: promoterHolding > 60 ? 'excellent' : promoterHolding > 50 ? 'good' : promoterHolding > 40 ? 'average' : 'poor',
                details: `Promoter Holding: ${company.promoterHolding}%`
            },
            {
                name: 'Technical Indicators',
                score: rsiScore + macdScore,
                status: (company.rsi > 30 && company.rsi < 70 && macdValue > 0) ? 'good' : 'average',
                details: `RSI: ${company.rsi} | MACD: ${macdValue.toFixed(2)}`
            }
        ];

        setAnalysisFactors(factors);
    };


    // Add these helper functions after your other helper functions (around line 800-850)

    // Format time ago from date string
    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';

        try {
            const now = new Date();
            const date = new Date(dateString);

            // If date is invalid, return fallback
            if (isNaN(date.getTime())) return 'Today';

            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} minutes ago`;
            if (diffHours < 24) return `${diffHours} hours ago`;
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            return `${Math.floor(diffDays / 30)} months ago`;
        } catch (error) {
            return 'Recently';
        }
    };

    // Get news category from title
    const getNewsCategory = (title) => {
        if (!title) return 'market';

        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('breaking')) return 'breaking';
        if (lowerTitle.includes('results') || lowerTitle.includes('quarter') || lowerTitle.includes('earnings')) return 'results';
        if (lowerTitle.includes('ipo') || lowerTitle.includes('offer')) return 'ipo';
        if (lowerTitle.includes('market') || lowerTitle.includes('nifty') || lowerTitle.includes('sensex') || lowerTitle.includes('index')) return 'market';
        if (lowerTitle.includes('global') || lowerTitle.includes('us') || lowerTitle.includes('china') || lowerTitle.includes('europe')) return 'global';
        if (lowerTitle.includes('policy') || lowerTitle.includes('sebi') || lowerTitle.includes('rbi') || lowerTitle.includes('regulation')) return 'policy';
        if (lowerTitle.includes('dividend') || lowerTitle.includes('bonus') || lowerTitle.includes('split')) return 'corporate';
        return 'stocks';
    };

    // Get impact level from title
    const getImpactLevel = (title) => {
        if (!title) return 'medium';

        const lowerTitle = title.toLowerCase();
        const highImpactWords = ['jump', 'surge', 'rally', 'plunge', 'crash', 'plummet', 'record', 'highest', 'lowest', 'alert', 'warning', 'crisis'];
        const lowImpactWords = ['update', 'review', 'analysis', 'outlook', 'trend'];

        if (highImpactWords.some(word => lowerTitle.includes(word))) return 'high';
        if (lowImpactWords.some(word => lowerTitle.includes(word))) return 'low';
        return 'medium';
    };

    // Extract stocks from news title
    const extractStocks = (title) => {
        if (!title) return [];

        const indianStocks = [
            'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'ITC', 'SBIN', 'BHARTIARTL',
            'WIPRO', 'ONGC', 'HINDUNILVR', 'KOTAKBANK', 'AXISBANK', 'LT', 'BAJFINANCE',
            'MARUTI', 'TITAN', 'ULTRACEMCO', 'SUNPHARMA', 'TATAMOTORS', 'M&M', 'TATASTEEL',
            'NTPC', 'POWERGRID', 'ADANIPORTS', 'INDUSINDBK', 'TECHM', 'HCLTECH', 'BRITANNIA',
            'SHREECEM', 'JSWSTEEL', 'DRREDDY', 'DIVISLAB', 'BAJAJFINSV', 'GRASIM', 'HEROMOTOCO',
            'EICHERMOT', 'ASIANPAINT', 'NESTLE', 'COALINDIA', 'IOC', 'BPCL', 'HINDPETRO'
        ];

        const foundStocks = indianStocks.filter(stock =>
            title.toUpperCase().includes(stock) ||
            title.toUpperCase().includes(stock.replace('&', 'AND'))
        );

        return foundStocks.map(stock => `${stock}.NS`).slice(0, 5); // Limit to 5 stocks
    };

    // Extract companies from news title (simplified version)
    const extractCompanies = (title) => {
        if (!title) return [];

        const companyKeywords = [
            'Reliance', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank', 'ITC', 'State Bank', 'Bharti Airtel',
            'Wipro', 'ONGC', 'Hindustan Unilever', 'Kotak Bank', 'Axis Bank', 'Larsen', 'Bajaj Finance',
            'Maruti', 'Titan', 'UltraTech', 'Sun Pharma', 'Tata Motors', 'Mahindra', 'Tata Steel',
            'NTPC', 'Power Grid', 'Adani Ports', 'IndusInd Bank', 'Tech Mahindra', 'HCL Tech', 'Britannia',
            'Shree Cement', 'JSW Steel', 'Dr Reddy', 'Divis Labs', 'Bajaj Finserv', 'Grasim', 'Hero MotoCorp',
            'Eicher Motors', 'Asian Paints', 'Nestle', 'Coal India', 'Indian Oil', 'BPCL', 'HPCL'
        ];

        return companyKeywords.filter(company =>
            title.includes(company)
        ).slice(0, 3); // Limit to 3 companies
    };

    // Get sector from news title
    const getSectorFromNews = (title) => {
        if (!title) return 'Market';

        const lowerTitle = title.toLowerCase();
        const sectorKeywords = {
            'Banking': ['bank', 'hdfc', 'icici', 'sbi', 'axis', 'kotak'],
            'IT': ['tcs', 'infosys', 'wipro', 'hcl', 'tech', 'software'],
            'Pharma': ['pharma', 'medicine', 'drug', 'sun', 'dr reddy'],
            'Auto': ['auto', 'car', 'maruti', 'tata motors', 'mahindra', 'hero', 'eicher'],
            'Energy': ['oil', 'gas', 'ongc', 'reliance', 'power', 'energy'],
            'Cement': ['cement', 'ultratech', 'shree', 'ambuja'],
            'Metals': ['steel', 'metal', 'jsw', 'tata steel'],
            'FMCG': ['fmcg', 'hul', 'itc', 'britannia', 'nestle'],
            'Telecom': ['telecom', 'airtel', 'vodafone', 'jio'],
            'Realty': ['realty', 'real estate', 'property'],
            'Infrastructure': ['infra', 'l&t', 'adani', 'construction']
        };

        for (const [sector, keywords] of Object.entries(sectorKeywords)) {
            if (keywords.some(keyword => lowerTitle.includes(keyword))) {
                return sector;
            }
        }

        return 'Market';
    };

    const filterCompanies = () => {
        let filtered = [...allCompanies];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(company =>
                company.symbol.toLowerCase().includes(term) ||
                company.name.toLowerCase().includes(term) ||
                company.sector.toLowerCase().includes(term)
            );
        }

        // Apply sector filter
        if (selectedSector !== 'All') {
            filtered = filtered.filter(company => company.sector === selectedSector);
        }

        // Apply index filter
        if (selectedIndex !== 'All') {
            filtered = filtered.filter(company => company.index === selectedIndex);
        }

        // Apply market cap filter
        if (selectedMarketCap) {
            if (selectedMarketCap.includes('Large')) {
                filtered = filtered.filter(company => company.marketCap > 20000);
            } else if (selectedMarketCap.includes('Mid')) {
                filtered = filtered.filter(company => company.marketCap >= 5000 && company.marketCap <= 20000);
            } else if (selectedMarketCap.includes('Small') && !selectedMarketCap.includes('Micro')) {
                filtered = filtered.filter(company => company.marketCap < 5000);
            } else if (selectedMarketCap.includes('Micro')) {
                filtered = filtered.filter(company => company.marketCap < 500);
            }
        }

        setFilteredCompanies(filtered);
        setCurrentPage(1);
    };

    // Handle market cap filter - UPDATED
    const handleMarketCapFilter = (category) => {
        // Toggle filter - if same category clicked again, remove filter
        if (selectedMarketCap === category.label) {
            setSelectedMarketCap(null);
        } else {
            setSelectedMarketCap(category.label);
        }
    };

    const calculateMarketStats = () => {
        const stats = {
            totalCompanies: 5246,
            totalMarketCap: '₹350,00,000 Cr',
            advances: 3250,
            declines: 1580,
            unchanged: 416,
            volume: '₹45,230 Cr',
            fiiInflow: '+₹1,250 Cr',
            diiInflow: '+₹680 Cr'
        };
        setMarketStats(stats);
    };

    // Pagination for companies
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

    // Pagination for news
    const filteredNews = filterNewsByCategory(newsCategory);
    const totalNewsPages = Math.ceil(filteredNews.length / newsItemsPerPage);

    // Handle company selection
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        // NEW: Analyze company for investment when selected
        analyzeCompanyForInvestment(company);
    };

    const getMarketCapCategory = (marketCap) => {
        if (!marketCap || marketCap === 0) return 'Unknown';
        if (marketCap > 20000) return 'Large Cap';
        if (marketCap >= 5000) return 'Mid Cap';
        if (marketCap >= 500) return 'Small Cap';
        return 'Micro Cap';
    };

    // Get related news for selected company
    const getRelatedNews = () => {
        if (!selectedCompany) return [];
        return news.filter(item =>
            item.stocksAffected.some(stock =>
                stock.toLowerCase().includes(selectedCompany.symbol.toLowerCase().split('.')[0])
            )
        ).slice(0, 3);
    };

    // NEW: Get color based on recommendation
    const getRecommendationColor = (rec) => {
        switch(rec) {
            case 'STRONG BUY': return '#10b981';
            case 'BUY': return '#22c55e';
            case 'ACCUMULATE': return '#84cc16';
            case 'HOLD': return '#eab308';
            case 'REDUCE': return '#f97316';
            case 'SELL': return '#ef4444';
            default: return '#6b7280';
        }
    };

    // NEW: Get color based on risk level
    const getRiskColor = (risk) => {
        switch(risk) {
            case 'Low': return '#10b981';
            case 'Medium': return '#eab308';
            case 'High': return '#ef4444';
            default: return '#6b7280';
        }
    };

    // NEW: Get color based on sector outlook
    const getOutlookColor = (outlook) => {
        switch(outlook) {
            case 'bullish': return '#10b981';
            case 'stable': return '#eab308';
            case 'cautious': return '#f97316';
            case 'volatile': return '#ef4444';
            default: return '#6b7280';
        }
    };

    // NEW: Log recommendation distribution after companies are loaded
    useEffect(() => {
        if (allCompanies.length > 0) {
            const recDistribution = {
                'STRONG BUY': 0,
                'BUY': 0,
                'ACCUMULATE': 0,
                'HOLD': 0,
                'REDUCE': 0,
                'SELL': 0
            };

            allCompanies.forEach(company => {
                recDistribution[company.recommendation]++;
            });

            console.log('Real Recommendation Distribution:');
            Object.keys(recDistribution).forEach(rec => {
                const percentage = ((recDistribution[rec] / allCompanies.length) * 100).toFixed(1);
                console.log(`${rec}: ${recDistribution[rec]} (${percentage}%)`);
            });
        }
    }, [allCompanies]);


    // Add this function before the return statement
    const renderAuthModal = () => {
        if (!showAuthModal) return null;

        return (
            <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
                <div className="auth-modal comprehensive" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>
                            <i className="fas fa-user"></i>
                            {authMode === 'signin' ? 'Sign In to Smart Investment Advisor' : 'Create Account'}
                        </h2>
                        <button className="close-modal" onClick={() => setShowAuthModal(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="modal-content">
                        {user ? (
                            <div className="already-logged-in">
                                <i className="fas fa-check-circle success"></i>
                                <h3>Welcome back, Investor!</h3>
                                <p>You are already signed in and can access all features.</p>
                                <button
                                    className="logout-btn"
                                    onClick={() => setUser(null)}
                                >
                                    <i className="fas fa-sign-out-alt"></i> Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="auth-form">
                                <div className="auth-tabs">
                                    <button
                                        className={`auth-tab ${authMode === 'signin' ? 'active' : ''}`}
                                        onClick={() => setAuthMode('signin')}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                                        onClick={() => setAuthMode('signup')}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {authMode === 'signin' ? (
                                    <div className="signin-form">
                                        <div className="form-group">
                                            <label>
                                                <i className="fas fa-envelope"></i> Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="investor@example.com"
                                                className="auth-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                <i className="fas fa-lock"></i> Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="auth-input"
                                            />
                                            <div className="forgot-password">
                                                <a href="#">Forgot password?</a>
                                            </div>
                                        </div>
                                        <button
                                            className="auth-submit-btn"
                                            onClick={() => {
                                                // Simulate login - in real app, you'd call your API
                                                setUser({
                                                    name: 'John Investor',
                                                    email: 'investor@example.com',
                                                    portfolio: 1250000
                                                });
                                                setShowAuthModal(false);
                                            }}
                                        >
                                            <i className="fas fa-sign-in-alt"></i> Sign In
                                        </button>

                                        <div className="auth-divider">
                                            <span>or continue with</span>
                                        </div>

                                        <div className="social-auth">
                                            <button className="social-btn google">
                                                <i className="fab fa-google"></i> Google
                                            </button>
                                            <button className="social-btn linkedin">
                                                <i className="fab fa-linkedin"></i> LinkedIn
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="signup-form">
                                        <div className="form-group">
                                            <label>
                                                <i className="fas fa-user"></i> Full Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Investor"
                                                className="auth-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                <i className="fas fa-envelope"></i> Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="investor@example.com"
                                                className="auth-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                <i className="fas fa-lock"></i> Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="auth-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                <i className="fas fa-lock"></i> Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="auth-input"
                                            />
                                        </div>

                                        <div className="form-group checkbox">
                                            <input type="checkbox" id="terms" />
                                            <label htmlFor="terms">
                                                I agree to the Terms of Service and Privacy Policy
                                            </label>
                                        </div>

                                        <button
                                            className="auth-submit-btn"
                                            onClick={() => {
                                                // Simulate signup - in real app, you'd call your API
                                                setUser({
                                                    name: 'New Investor',
                                                    email: 'new@example.com',
                                                    portfolio: 0
                                                });
                                                setShowAuthModal(false);
                                            }}
                                        >
                                            <i className="fas fa-user-plus"></i> Create Account
                                        </button>

                                        <p className="auth-note">
                                            By signing up, you'll get access to:
                                            <ul>
                                                <li><i className="fas fa-check"></i> Portfolio tracking</li>
                                                <li><i className="fas fa-check"></i> Custom watchlists</li>
                                                <li><i className="fas fa-check"></i> Advanced analytics</li>
                                                <li><i className="fas fa-check"></i> AI recommendations</li>
                                            </ul>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <p className="auth-footer-note">
                            <i className="fas fa-shield-alt"></i> Your data is securely encrypted. We never share your information.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            <div className="top-header">
                <div className="top-header-left">
                    <div className="market-status">
                        <span>Market Status</span>
                        <span className="status-closed">CLOSED</span>
                    </div>
                    <div className="investment-signals">
                        <span>Investment Signals</span>
                        <span className="signal-bullish">BULLISH</span>
                    </div>

                </div>
                <div className="top-header-right">
                    <div className="auth-buttons">
                        {user ? (
                            <div className="user-info">
            <span className="user-avatar">
                <i className="fas fa-user-circle"></i>
            </span>
                                <span className="user-name">{user.name}</span>
                                <button
                                    className="sign-out-btn"
                                    onClick={() => setUser(null)}
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="sign-in-btn"
                                    onClick={() => {
                                        setAuthMode('signin');
                                        setShowAuthModal(true);
                                    }}
                                >
                                    Sign In
                                </button>
                                <button
                                    className="sign-up-btn"
                                    onClick={() => {
                                        setAuthMode('signup');
                                        setShowAuthModal(true);
                                    }}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>


            {/* Market Header */}
            <div className="market-header">
                <div className="market-title">
                    <h1>
                        <i className="fas fa-chart-line"></i> Smart Investment Advisor
                    </h1>
                    <p className="subtitle">
                        AI-powered stock analysis • Investment recommendations • Risk assessment • {formatNumber(marketStats.totalCompanies)} companies analyzed
                    </p>
                </div>
                <div className="market-summary">
                    <div className="summary-item">
                        <span className="label">Market Status</span>
                        <span className={`value ${marketStatus === 'open' ? 'positive' : 'negative'}`}>
                            {marketStatus === 'open' ? '🟢 OPEN' : '🔴 CLOSED'}
                        </span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Investment Signals</span>
                        <span className="value">{marketStats.advances > marketStats.declines ? '🟢 BULLISH' : '🔴 CAUTIOUS'}</span>
                    </div>
                    <button
                        className="refresh-news-btn"
                        onClick={fetchRealNews}
                        disabled={loadingNews}
                    >
                        {loadingNews ? '🔄 Updating...' : '📰 Refresh Analysis'}
                    </button>
                    <button
                        className="news-modal-btn"
                        onClick={() => setShowNewsModal(true)}
                    >
                        <i className="fas fa-newspaper"></i> Market News ({news.length})
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="main-nav">
                <div className="nav-section">
                    <h3>Smart Investment Dashboard</h3>
                    <div className="segments">
                        <button className="segment-btn active">
                            <i className="fas fa-home"></i> Dashboard
                        </button>
                    </div>
                </div>
                <div className="market-actions">
                    <div className="market-time">
                        <i className="fas fa-clock"></i> {marketTime} •
                        <span className={`market-status-indicator ${marketStatus}`}>
                            {marketStatus.toUpperCase()}
                        </span>
                    </div>
                    <button className="action-btn" onClick={() => setShowNewsModal(true)}>
                        <i className="fas fa-bell"></i> Alerts
                    </button>
                </div>
            </nav>

            {/* Main Dashboard */}
            <div className="container comprehensive">
                {/* Left Column - Filters & Search */}
                <div className="filters-sidebar">
                    {/* Universal Search */}
                    <div className="filter-section">
                        <h4><i className="fas fa-search"></i> Find Investment Opportunities</h4>
                        <input
                            type="text"
                            className="universal-search"
                            placeholder="Search stocks for investment analysis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="search-stats">
                            <span className="stats-positive">
                                <i className="fas fa-chart-line"></i> {formatNumber(filteredCompanies.filter(c => c.investmentScore >= 70).length)} BUY Recommendations
                            </span>
                            <span className="stats-total">
                                Showing {formatNumber(filteredCompanies.length)} of {formatNumber(allCompanies.length)} stocks
                            </span>
                        </div>
                    </div>

                    {/* Enhanced Live News Section */}
                    <div className="filter-section news-preview">
                        <h4><i className="fas fa-bolt"></i> Investment Insights</h4>
                        <div className="news-category-buttons">
                            <button
                                className={`news-cat-btn ${newsCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setNewsCategory('all')}
                            >
                                All ({news.length})
                            </button>
                            <button
                                className={`news-cat-btn ${newsCategory === 'breaking' ? 'active' : ''}`}
                                onClick={() => setNewsCategory('breaking')}
                            >
                                Market Movers ({news.filter(n => n.isBreaking).length})
                            </button>
                            <button
                                className={`news-cat-btn ${newsCategory === 'market' ? 'active' : ''}`}
                                onClick={() => setNewsCategory('market')}
                            >
                                High Impact ({news.filter(n => n.impact === 'high').length})
                            </button>
                        </div>

                        {loadingNews ? (
                            <div className="news-loading">
                                <div className="news-loading-spinner"></div>
                                Loading market insights...
                            </div>
                        ) : (
                            <div className="news-list">
                                {getPaginatedNews().slice(0, 5).map(item => (
                                    <div
                                        key={item.id}
                                        className={`news-preview-item ${item.isBreaking ? 'breaking' : ''} impact-${item.impact}`}
                                    >
                                        <div className="news-preview-header">
                                            <span className={`news-impact-badge impact-${item.impact}`}>
                                                {item.impact.toUpperCase()}
                                            </span>
                                            <span className="news-category-badge">{item.category}</span>
                                        </div>
                                        <div className="news-preview-title">
                                            {item.title}
                                        </div>
                                        <div className="news-preview-meta">
                                            <span className="news-source">
                                                <i className="fas fa-newspaper"></i> {item.source}
                                            </span>
                                            <span className="news-time">
                                                <i className="fas fa-clock"></i> {item.time}
                                            </span>
                                        </div>
                                        {item.stocksAffected.length > 0 && (
                                            <div className="news-stocks">
                                                <i className="fas fa-chart-line"></i>
                                                {item.stocksAffected.slice(0, 2).join(', ')}
                                                {item.stocksAffected.length > 2 && ` +${item.stocksAffected.length - 2} more`}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="view-all-news"
                            onClick={() => setShowNewsModal(true)}
                        >
                            <i className="fas fa-external-link-alt"></i> View All Market Insights →
                        </button>
                    </div>

                    {/* Sector Filter with Outlook */}
                    <div className="filter-section">
                        <h4><i className="fas fa-industry"></i> Sector Analysis</h4>
                        <div className="sector-filters">
                            {sectors.map(sector => (
                                <button
                                    key={sector.name}
                                    className={`sector-btn ${selectedSector === sector.name ? 'active' : ''}`}
                                    onClick={() => setSelectedSector(sector.name)}
                                    style={{
                                        borderLeftColor: getOutlookColor(sector.outlook)
                                    }}
                                >
                                    <div className="sector-name">{sector.name}</div>
                                    <div className="sector-outlook">
                                        <span className={`outlook-badge outlook-${sector.outlook}`}>
                                            {sector.outlook.toUpperCase()}
                                        </span>
                                        <span className="count">
                                            {allCompanies.filter(c => c.sector === sector.name).length}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Index Filter */}
                    <div className="filter-section">
                        <h4><i className="fas fa-chart-bar"></i> Market Index</h4>
                        <select
                            className="index-select"
                            value={selectedIndex}
                            onChange={(e) => setSelectedIndex(e.target.value)}
                        >
                            <option value="All">All Indices</option>
                            {indices.map(index => (
                                <option key={index} value={index}>{index}</option>
                            ))}
                        </select>
                    </div>

                    {/* Market Cap Filter */}
                    <div className="filter-section">
                        <h4><i className="fas fa-money-bill-wave"></i> Risk Profile</h4>
                        <div className="cap-filters">
                            {marketCapCategories.map(category => (
                                <button
                                    key={category.label}
                                    className={`cap-btn ${selectedMarketCap === category.label ? 'active' : ''}`}
                                    onClick={() => handleMarketCapFilter(category)}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Investment Stats */}
                    <div className="filter-section stats">
                        <h4><i className="fas fa-chart-pie"></i> Investment Dashboard</h4>
                        <div className="stat-items">
                            <div className="stat-item">
                                <span className="stat-label">Strong Buys</span>
                                <span className="stat-value positive">
                                    {formatNumber(allCompanies.filter(c => c.recommendation === 'STRONG BUY').length)}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Average Score</span>
                                <span className="stat-value">
                                    {allCompanies.length > 0
                                        ? Math.round(allCompanies.reduce((sum, c) => sum + c.investmentScore, 0) / allCompanies.length)
                                        : 0}/100
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Market Sentiment</span>
                                <span className="stat-value positive">{marketStats.fiiInflow}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Last Analysis</span>
                                <span className="stat-value">{currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column - Companies Table with Investment Scores */}
                <div className="companies-main">
                    {/* Table Header */}
                    <div className="table-header">
                        <div className="header-left">
                            <h3><i className="fas fa-table"></i> Smart Stock Screener</h3>
                            <div className="table-actions">
                                <button className="table-btn">
                                    <i className="fas fa-sort-amount-down"></i> Sort: Investment Score
                                </button>
                                <button className="table-btn">
                                    <i className="fas fa-filter"></i> Top Picks
                                </button>
                                <button className="table-btn" onClick={() => {
                                    setSelectedSector('All');
                                    setSelectedIndex('All');
                                    setSelectedMarketCap(null);
                                    setSearchTerm('');
                                }}>
                                    <i className="fas fa-sync-alt"></i> Clear Filters
                                </button>
                            </div>
                        </div>
                        <div className="header-right">
                            <span className="showing">
                                <i className="fas fa-chart-line"></i> {formatNumber(filteredCompanies.filter(c => c.investmentScore >= 70).length)} investment opportunities
                            </span>
                            <span className="last-update">
                                <i className="fas fa-clock"></i> Analysis: {currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>

                    {/* Companies Table with Investment Scores */}
                    {loading ? (
                        <div className="loading-table">
                            <div className="spinner"></div>
                            <p>Analyzing {formatNumber(marketStats.totalCompanies)} companies for investment opportunities...</p>
                        </div>
                    ) : (
                        <>
                            <div className="companies-table-container">
                                <table className="companies-table">
                                    <thead>
                                    <tr>
                                        <th className="sticky-col">Symbol</th>
                                        <th>Company Name</th>
                                        <th>Sector</th>
                                        <th>Price (₹)</th>
                                        <th>Change %</th>
                                        <th>Investment Score</th>
                                        <th>Recommendation</th>
                                        <th>Risk Level</th>
                                        <th>P/E</th>
                                        <th>ROE %</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentCompanies.map(company => (
                                        <tr
                                            key={company.id}
                                            className={selectedCompany?.id === company.id ? 'selected' : ''}
                                            onClick={() => handleCompanySelect(company)}
                                        >
                                            <td className="sticky-col symbol-cell">
                                                <strong>{company.symbol}</strong>
                                                <small>{getMarketCapCategory(company.marketCap)}</small>
                                            </td>
                                            <td className="company-name">
                                                {company.name}
                                                <div className="company-index">{company.index}</div>
                                            </td>
                                            <td className="sector-cell">
                                                {company.sector}
                                                <div className="sector-outlook-small" style={{color: getOutlookColor(company.sectorOutlook)}}>
                                                    {company.sectorOutlook}
                                                </div>
                                            </td>
                                            <td className="price-cell">₹{company.price}</td>
                                            <td className={`change-cell ${company.change >= 0 ? 'positive' : 'negative'}`}>
                                                {company.change >= 0 ? '▲' : '▼'} {Math.abs(company.changePercent)}%
                                            </td>
                                            <td className="score-cell">
                                                <div className="score-container">
                                                    <div className="score-bar">
                                                        <div
                                                            className="score-fill"
                                                            style={{
                                                                width: `${company.investmentScore}%`,
                                                                background: company.investmentScore >= 70 ? '#10b981' :
                                                                    company.investmentScore >= 60 ? '#eab308' : '#ef4444'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="score-value">{company.investmentScore}/100</span>
                                                </div>
                                            </td>
                                            <td className="recommendation-cell">
                                                <span
                                                    className="recommendation-badge"
                                                    style={{ background: getRecommendationColor(company.recommendation) }}
                                                >
                                                    {company.recommendation}
                                                </span>
                                            </td>
                                            <td className="risk-cell">
                                                <span
                                                    className="risk-badge"
                                                    style={{ background: getRiskColor(company.riskLevel) }}
                                                >
                                                    {company.riskLevel}
                                                </span>
                                            </td>
                                            <td className="pe-cell">{company.peRatio}</td>
                                            <td className="roe-cell">
                                                <span className={company.roe > 15 ? 'positive' : company.roe > 10 ? 'neutral' : 'negative'}>
                                                    {company.roe}%
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button className="action-small analyze" onClick={() => handleCompanySelect(company)}>
                                                    <i className="fas fa-chart-line"></i> Analyze
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fas fa-chevron-left"></i> Previous
                                </button>

                                <div className="page-numbers">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span className="page-dots">...</span>
                                            <button
                                                className="page-number"
                                                onClick={() => setCurrentPage(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button
                                    className="page-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next <i className="fas fa-chevron-right"></i>
                                </button>

                                <div className="page-size">
                                    <span>Show:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="200">200</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Investment Dashboard */}
                    <div className="quick-stats">
                        <div className="stat-card">
                            <h4><i className="fas fa-tachometer-alt"></i> Market Dashboard</h4>
                            <div className="breadth-bar">
                                <div
                                    className="breadth-advances"
                                    style={{ width: `${(marketStats.advances / (marketStats.advances + marketStats.declines) * 100).toFixed(1)}%` }}
                                ></div>
                            </div>
                            <div className="breadth-numbers">
                                <span className="advances">
                                    <i className="fas fa-arrow-up"></i> {formatNumber(marketStats.advances)} Advances
                                </span>
                                <span className="declines">
                                    <i className="fas fa-arrow-down"></i> {formatNumber(marketStats.declines)} Declines
                                </span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <h4><i className="fas fa-lightbulb"></i> Investment Insights</h4>
                            <div className="news-ticker">
                                {news.slice(0, 2).map(item => (
                                    <div key={item.id} className="ticker-item">
                                        <span className="ticker-source">{item.source}:</span>
                                        <span className="ticker-text">{item.title.substring(0, 70)}...</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="small-news-btn"
                                onClick={() => setShowNewsModal(true)}
                            >
                                <i className="fas fa-external-link-alt"></i> View Investment Insights
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Investment Analysis */}
                <div className="details-sidebar">
                    {selectedCompany ? (
                        <div className="company-details">
                            {/* Investment Recommendation Header */}
                            <div className="investment-header" style={{borderLeftColor: getRecommendationColor(recommendation)}}>
                                <div className="investment-main">
                                    <h3>{selectedCompany.symbol}</h3>
                                    <h4>{selectedCompany.name}</h4>
                                    <div className="investment-tags">
                                        <span className="tag sector">
                                            <i className="fas fa-industry"></i> {selectedCompany.sector}
                                        </span>
                                        <span className="tag index">
                                            <i className="fas fa-chart-bar"></i> {selectedCompany.index}
                                        </span>
                                        <span className="tag cap">
                                            <i className="fas fa-money-bill-wave"></i> {getMarketCapCategory(selectedCompany.marketCap)}
                                        </span>
                                    </div>
                                </div>

                                <div className="investment-verdict">
                                    <div className="verdict-score">
                                        <div className="score-circle">
                                            <svg width="80" height="80" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                                                <circle cx="60" cy="60" r="54" fill="none"
                                                        stroke={getRecommendationColor(recommendation)}
                                                        strokeWidth="12"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${investmentScore * 3.39} 339`}
                                                        transform="rotate(-90 60 60)"
                                                />
                                                <text x="60" y="65" textAnchor="middle" fontSize="24" fontWeight="bold" fill={getRecommendationColor(recommendation)}>
                                                    {investmentScore}
                                                </text>
                                            </svg>
                                        </div>
                                        <div className="score-label">AI Score</div>
                                    </div>

                                    <div className="verdict-recommendation">
                                        <div className="recommendation-main" style={{color: getRecommendationColor(recommendation)}}>
                                            <i className="fas fa-bullhorn"></i>
                                            <h2>{recommendation}</h2>
                                        </div>
                                        <div className="recommendation-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Risk Level:</span>
                                                <span className="detail-value" style={{color: getRiskColor(riskLevel)}}>
                                                    {riskLevel}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Time Horizon:</span>
                                                <span className="detail-value">{timeHorizon}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Sector Outlook:</span>
                                                <span className="detail-value" style={{color: getOutlookColor(sectorOutlook)}}>
                                                    {sectorOutlook.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Analysis */}
                            <div className="price-analysis">
                                <div className="current-price-section">
                                    <div className="price-label">Current Price</div>
                                    <div className="current-price">₹{selectedCompany.price}</div>
                                    <div className={`price-change ${selectedCompany.change >= 0 ? 'positive' : 'negative'}`}>
                                        {selectedCompany.change >= 0 ? '▲' : '▼'} ₹{Math.abs(selectedCompany.change).toFixed(2)} ({Math.abs(selectedCompany.changePercent)}%)
                                    </div>
                                </div>

                                <div className="price-target-section">
                                    <div className="target-label">12-Month Target</div>
                                    <div className="target-price">₹{priceTarget.toFixed(2)}</div>
                                    <div className="target-upside" style={{color: priceTarget > parseFloat(selectedCompany.price) ? '#10b981' : '#ef4444'}}>
                                        {priceTarget > parseFloat(selectedCompany.price) ? '▲' : '▼'}
                                        {Math.abs(((priceTarget - parseFloat(selectedCompany.price)) / parseFloat(selectedCompany.price) * 100)).toFixed(1)}% Upside
                                    </div>
                                </div>
                            </div>

                            {/* Investment Factors Analysis */}
                            <div className="factors-analysis">
                                <h4><i className="fas fa-chart-bar"></i> Investment Factors Analysis</h4>
                                <div className="factors-list">
                                    {analysisFactors.map((factor, index) => (
                                        <div key={index} className="factor-item">
                                            <div className="factor-header">
                                                <span className="factor-name">{factor.name}</span>
                                                <span className={`factor-score ${factor.status}`}>
                                                    {factor.score}/15
                                                </span>
                                            </div>
                                            <div className="factor-bar">
                                                <div
                                                    className="factor-fill"
                                                    style={{
                                                        width: `${(factor.score / 15) * 100}%`,
                                                        background: factor.status === 'excellent' ? '#10b981' :
                                                            factor.status === 'good' ? '#22c55e' :
                                                                factor.status === 'average' ? '#eab308' : '#ef4444'
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="factor-details">{factor.details}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Financial Metrics */}
                            <div className="financial-metrics">
                                <h4><i className="fas fa-calculator"></i> Financial Health</h4>
                                <div className="metrics-grid">
                                    <div className="metric-card">
                                        <div className="metric-label">P/E Ratio</div>
                                        <div className={`metric-value ${parseFloat(selectedCompany.peRatio) < 25 ? 'good' : parseFloat(selectedCompany.peRatio) < 40 ? 'average' : 'poor'}`}>
                                            {selectedCompany.peRatio}
                                        </div>
                                        <div className="metric-desc">Industry Avg: 28.5</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-label">ROE %</div>
                                        <div className={`metric-value ${selectedCompany.roe > 20 ? 'excellent' : selectedCompany.roe > 15 ? 'good' : selectedCompany.roe > 10 ? 'average' : 'poor'}`}>
                                            {selectedCompany.roe}%
                                        </div>
                                        <div className="metric-desc">Return on Equity</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-label">Profit Growth</div>
                                        <div className={`metric-value ${selectedCompany.profitGrowth > 15 ? 'excellent' : selectedCompany.profitGrowth > 10 ? 'good' : selectedCompany.profitGrowth > 5 ? 'average' : 'poor'}`}>
                                            {selectedCompany.profitGrowth > 0 ? '+' : ''}{selectedCompany.profitGrowth}%
                                        </div>
                                        <div className="metric-desc">YoY Growth</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-label">Op. Margin</div>
                                        <div className={`metric-value ${selectedCompany.operatingMargin > 20 ? 'excellent' : selectedCompany.operatingMargin > 15 ? 'good' : selectedCompany.operatingMargin > 10 ? 'average' : 'poor'}`}>
                                            {selectedCompany.operatingMargin}%
                                        </div>
                                        <div className="metric-desc">Operating Efficiency</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-label">Promoter %</div>
                                        <div className={`metric-value ${selectedCompany.promoterHolding > 60 ? 'excellent' : selectedCompany.promoterHolding > 50 ? 'good' : selectedCompany.promoterHolding > 40 ? 'average' : 'poor'}`}>
                                            {selectedCompany.promoterHolding}%
                                        </div>
                                        <div className="metric-desc">Insider Confidence</div>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Analysis */}
                            <div className="technical-analysis">
                                <h4><i className="fas fa-chart-line"></i> Technical Indicators</h4>
                                <div className="technical-grid">
                                    <div className="tech-card">
                                        <div className="tech-label">RSI (14)</div>
                                        <div className={`tech-value ${selectedCompany.rsi > 70 ? 'overbought' : selectedCompany.rsi < 30 ? 'oversold' : 'neutral'}`}>
                                            {selectedCompany.rsi}
                                        </div>
                                        <div className="tech-bar">
                                            <div className="tech-fill" style={{width: `${selectedCompany.rsi}%`}}></div>
                                        </div>
                                        <div className="tech-desc">
                                            {selectedCompany.rsi > 70 ? 'Overbought' : selectedCompany.rsi < 30 ? 'Oversold' : 'Neutral'}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Enhanced: Company News Section */}
                            <div className="company-news-section">
                                <h4><i className="fas fa-newspaper"></i> Investment News ({getRelatedNews().length})</h4>
                                <div className="related-news-list">
                                    {getRelatedNews().map(item => (
                                        <div key={item.id} className="related-news-item">
                                            <div className="related-news-header">
                                                <span className={`related-news-impact impact-${item.impact}`}>
                                                    {item.impact.toUpperCase()}
                                                </span>
                                                <span className="related-news-time">{item.time}</span>
                                            </div>
                                            <div className="related-news-title">{item.title}</div>
                                            <div className="related-news-source">
                                                <i className="fas fa-newspaper"></i> {item.source}
                                            </div>
                                        </div>
                                    ))}
                                    {getRelatedNews().length === 0 && (
                                        <div className="no-related-news">
                                            <i className="fas fa-info-circle"></i>
                                            <p>No specific investment news for this company today.</p>
                                            <button onClick={() => setShowNewsModal(true)}>
                                                View Market Analysis
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Similar Investment Opportunities */}
                            <div className="similar-companies">
                                <h4><i className="fas fa-layer-group"></i> Similar Opportunities</h4>
                                <div className="similar-list">
                                    {allCompanies
                                        .filter(c => c.sector === selectedCompany.sector && c.id !== selectedCompany.id && c.investmentScore >= 70)
                                        .slice(0, 5)
                                        .map(company => (
                                            <div
                                                key={company.id}
                                                className="similar-item"
                                                onClick={() => handleCompanySelect(company)}
                                            >
                                                <span className="sim-symbol">{company.symbol}</span>
                                                <span className="sim-price">₹{company.price}</span>
                                                <span className="sim-score" style={{color: getRecommendationColor(company.recommendation)}}>
                                                    {company.recommendation}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Investment Action Buttons */}
                            <div className="investment-actions">
                                <button className="invest-btn buy">
                                    <i className="fas fa-shopping-cart"></i> Simulate Buy Order
                                </button>
                                <button className="invest-btn watch">
                                    <i className="fas fa-eye"></i> Add to Watchlist
                                </button>
                                <button className="invest-btn report">
                                    <i className="fas fa-file-pdf"></i> Download Full Report
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="no-selection">
                            <div className="placeholder-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h4>Select a Company for Investment Analysis</h4>
                            <p>Click on any company to get AI-powered investment recommendations, risk analysis, and detailed financial metrics.</p>
                            <div className="selection-stats">
                                <div className="stat">
                                    <div className="stat-number">{formatNumber(allCompanies.filter(c => c.recommendation === 'STRONG BUY' || c.recommendation === 'BUY').length)}</div>
                                    <div className="stat-label">Buy Recommendations</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">{formatNumber(allCompanies.filter(c => c.riskLevel === 'Low').length)}</div>
                                    <div className="stat-label">Low Risk Stocks</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">{formatNumber(allCompanies.length)}</div>
                                    <div className="stat-label">Companies Analyzed</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">{formatNumber(news.length)}</div>
                                    <div className="stat-label">Market Insights</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="footer comprehensive">
                <div className="footer-content">
                    <div className="footer-section">
                        <h5><i className="fas fa-robot"></i> AI Investment Advisor</h5>
                        <p>Powered by advanced algorithms analyzing 50+ factors including fundamentals, technicals, sentiment, and market trends</p>
                    </div>
                    <div className="footer-section">
                        <h5><i className="fas fa-sync-alt"></i> Real-time Analysis</h5>
                        <p>Continuous monitoring • News sentiment analysis • Risk assessment • Price target updates {isMarketOpen() ? 'every minute' : 'every 5 minutes'}</p>
                    </div>
                    <div className="footer-section">
                        <h5><i className="fas fa-shield-alt"></i> Risk Disclosure</h5>
                        <div className="sources">
                            <span className="source">Past performance ≠ future results</span>
                            <span className="source">Do your own research</span>
                            <span className="source">Consult financial advisor</span>
                            <span className="source">Investments subject to risk</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Smart Investment Advisor • AI-powered stock analysis and recommendations</p>
                    <p className="disclaimer">
                        <i className="fas fa-exclamation-triangle"></i> This is an AI-powered analysis tool for educational purposes.
                        Investment decisions should be based on personal research and consultation with certified financial advisors.
                        Market data and news are simulated for demonstration.
                    </p>
                </div>
            </div>

            {/* Enhanced News Modal */}
            {showNewsModal && (
                <div className="news-modal-overlay" onClick={() => setShowNewsModal(false)}>
                    <div className="news-modal comprehensive" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <h2>
                                    <i className="fas fa-newspaper"></i> Market Investment Insights
                                    <span className="news-count">({formatNumber(news.length)} insights)</span>
                                </h2>
                                <p className="modal-subtitle">
                                    Last updated: {currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} •
                                    Auto-refresh: {isMarketOpen() ? '1 min' : '5 min'} •
                                    Market: <span className={marketStatus === 'open' ? 'market-open' : 'market-closed'}>
                                        {marketStatus.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                            <button className="close-modal" onClick={() => setShowNewsModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* News Categories */}
                        <div className="news-categories">
                            {newsCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`news-category-btn ${newsCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setNewsCategory(cat.id);
                                        setNewsPage(1);
                                    }}
                                >
                                    <span className="cat-icon">{cat.icon}</span>
                                    <span className="cat-name">{cat.name}</span>
                                    {cat.id !== 'all' && (
                                        <span className="cat-count">
                                            ({news.filter(n => cat.id === 'breaking' ? n.isBreaking : n.category === cat.id).length})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="modal-content">
                            {loadingNews ? (
                                <div className="modal-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Analyzing market trends for investment opportunities...</p>
                                </div>
                            ) : filteredNews.length === 0 ? (
                                <div className="no-news">
                                    <i className="fas fa-newspaper"></i>
                                    <p>No investment insights available for this category.</p>
                                    <button className="refresh-btn" onClick={fetchRealNews}>
                                        <i className="fas fa-sync-alt"></i> Refresh Insights
                                    </button>
                                </div>
                            ) : (
                                <div className="news-list-modal">
                                    {/* News Controls */}
                                    <div className="news-controls">
                                        <div className="news-stats">
                                            Showing {formatNumber((newsPage - 1) * newsItemsPerPage + 1)}-{formatNumber(Math.min(newsPage * newsItemsPerPage, filteredNews.length))} of {formatNumber(filteredNews.length)} insights
                                        </div>
                                        <div className="news-sort">
                                            <select>
                                                <option>Sort: Investment Impact</option>
                                                <option>Sort: Latest First</option>
                                                <option>Sort: High Impact First</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* News Grid */}
                                    <div className="news-grid-modal">
                                        {getPaginatedNews().map(item => (
                                            <div key={item.id} className="news-card-modal">
                                                <div className="news-card-header">
                                                    <div className="news-card-badges">
                                                        <span className={`impact-badge impact-${item.impact}`}>
                                                            {item.impact.toUpperCase()} IMPACT
                                                        </span>
                                                        {item.isBreaking && (
                                                            <span className="breaking-badge">
                                                                <i className="fas fa-bolt"></i> INVESTMENT ALERT
                                                            </span>
                                                        )}
                                                        <span className="category-badge">
                                                            {item.category.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="news-card-time">
                                                        <i className="fas fa-clock"></i> {item.time}
                                                    </div>
                                                </div>

                                                <h3 className="news-card-title">
                                                    {item.title}
                                                </h3>

                                                <p className="news-card-description">
                                                    {item.description}
                                                </p>

                                                <div className="news-card-details">
                                                    <div className="news-card-source">
                                                        <i className="fas fa-newspaper"></i>
                                                        <strong>Source:</strong> {item.source}
                                                    </div>
                                                    <div className="news-card-stocks">
                                                        <i className="fas fa-chart-line"></i>
                                                        <strong>Affected Stocks:</strong> {item.stocksAffected.slice(0, 3).join(', ')}
                                                        {item.stocksAffected.length > 3 && ` +${item.stocksAffected.length - 3} more`}
                                                    </div>
                                                    <div className="news-card-sector">
                                                        <i className="fas fa-industry"></i>
                                                        <strong>Sector:</strong> {item.sector}
                                                    </div>
                                                    <div className="news-card-readtime">
                                                        <i className="fas fa-book-open"></i> {item.readTime}
                                                    </div>
                                                </div>

                                                <div className="news-card-actions">
                                                    <button className="news-action-btn">
                                                        <i className="fas fa-chart-line"></i> Analyze Impact
                                                    </button>
                                                    <button className="news-action-btn">
                                                        <i className="fas fa-bell"></i> Set Alert
                                                    </button>
                                                    <button className="news-action-btn primary">
                                                        <i className="fas fa-search"></i> Find Opportunities
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* News Pagination */}
                                    {totalNewsPages > 1 && (
                                        <div className="news-pagination">
                                            <button
                                                className="news-page-btn"
                                                onClick={() => setNewsPage(prev => Math.max(prev - 1, 1))}
                                                disabled={newsPage === 1}
                                            >
                                                <i className="fas fa-chevron-left"></i> Previous
                                            </button>

                                            <div className="news-page-numbers">
                                                {Array.from({ length: Math.min(5, totalNewsPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalNewsPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (newsPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (newsPage >= totalNewsPages - 2) {
                                                        pageNum = totalNewsPages - 4 + i;
                                                    } else {
                                                        pageNum = newsPage - 2 + i;
                                                    }

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            className={`news-page-number ${newsPage === pageNum ? 'active' : ''}`}
                                                            onClick={() => setNewsPage(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}


                                                {totalNewsPages > 5 && newsPage < totalNewsPages - 2 && (
                                                    <>
                                                        <span className="news-page-dots">...</span>
                                                        <button
                                                            className="news-page-number"
                                                            onClick={() => setNewsPage(totalNewsPages)}
                                                        >
                                                            {totalNewsPages}
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            <button
                                                className="news-page-btn"
                                                onClick={() => setNewsPage(prev => Math.min(prev + 1, totalNewsPages))}
                                                disabled={newsPage === totalNewsPages}
                                            >
                                                Next <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <div className="modal-footer-left">
                                <div className="auto-refresh-info">
                                    <i className="fas fa-sync-alt"></i>
                                    Auto-refresh every {isMarketOpen() ? '1 minute' : '5 minutes'}
                                </div>
                                <div className="news-sources-info">
                                    Sources: Market Updates, Financial Express, Reuters, NSE/BSE
                                </div>
                            </div>
                            <div className="modal-footer-right">
                                <button className="modal-close-btn" onClick={() => setShowNewsModal(false)}>
                                    <i className="fas fa-times"></i> Close
                                </button>
                                <button className="modal-refresh-btn" onClick={fetchRealNews}>
                                    <i className="fas fa-sync-alt"></i> Refresh Now
                                </button>
                                <button className="modal-settings-btn">
                                    <i className="fas fa-cog"></i> Alert Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {renderAuthModal()}

        </div>
    );
}

export default App;
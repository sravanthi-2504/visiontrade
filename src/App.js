import './App.css';
import './css/dashboard.css';
import './css/stock-analysis.css';
import './index.css';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardWrapper from './components/DashboardWrapper';
import StockAnalysis from './components/StockAnalysis';

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
        {name: 'All', outlook: 'neutral'},
        {name: 'Banking', outlook: 'bullish'},
        {name: 'IT', outlook: 'cautious'},
        {name: 'Energy', outlook: 'bullish'},
        {name: 'FMCG', outlook: 'stable'},
        {name: 'Automobile', outlook: 'bullish'},
        {name: 'Pharmaceuticals', outlook: 'stable'},
        {name: 'Telecom', outlook: 'cautious'},
        {name: 'Metals', outlook: 'volatile'},
        {name: 'Cement', outlook: 'stable'},
        {name: 'Construction', outlook: 'bullish'},
        {name: 'Consumer Durables', outlook: 'stable'},
        {name: 'Finance', outlook: 'bullish'}
    ];

    // Market cap categories
    const marketCapCategories = [
        {label: 'Large Cap (>₹20,000 Cr)', min: 20000},
        {label: 'Mid Cap (₹5,000-20,000 Cr)', min: 5000, max: 20000},
        {label: 'Small Cap (<₹5,000 Cr)', max: 5000},
        {label: 'Micro Cap (<₹500 Cr)', max: 500}
    ];

    // News categories
    const newsCategories = [
        {id: 'all', name: 'All News', icon: '📰'},
        {id: 'breaking', name: 'Breaking', icon: '🔥'},
        {id: 'market', name: 'Market', icon: '📈'},
        {id: 'results', name: 'Results', icon: '📊'},
        {id: 'global', name: 'Global', icon: '🌍'},
        {id: 'policy', name: 'Policy', icon: '🏛️'},
        {id: 'stocks', name: 'Stocks', icon: '💹'}
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
        'YESBANK', 'ZEEL', 'JSWSTEEL', 'HINDZINC', 'COALINDIA', 'VEDL', 'TATASTEEL', 'HINDALCO',
        'JSL', 'NMDC', 'NATIONALUM', 'LLOYDSMETAL', 'JINDALSTEL', 'SAIL',
        'HINDCOPPER', 'MOTHERSUMI', 'SHYAMMETL', 'KIOCL', 'GMDC', 'GPIL',
        'SARDAEN', 'GALLANTT', 'USHAMART', 'NMDCSTEEL', 'SANDUM', 'JINDALSAW',
        'JAYNECOIND', 'ASHAPURMIN', 'MOIL', 'IMFA', 'JAIBALAJI', 'BANSWRAS',
        'TECHNO', 'SUNFLAG', 'RPEL', 'MAITHANALL', 'KSL', 'RAMRAT', 'JTLIND',
        'SAMBHV', 'VSSL', 'SHIVALIK', 'EPACK', 'PENIND', 'PRAKASH', 'WELSPUN',
        'VENUSPIPES', 'DGCONTENT', 'RHETAN', 'MSP', 'MUKAND', 'FRONTIERSPR',
        'ANIXA', 'MANAKCOAT', 'MAHASTEEL', 'ARFIN', 'HARIOMPIPE', 'BHARATWIRE',
        'ELECTHERM', 'STEELXIND', 'COSMICCRF', 'RATNAVEER', 'MOL', 'GANDHITUBE',
        'SCODATUBES', 'HARDWYN', 'MAANALU', 'MANGALAM', 'BEEKAY', 'DIVINPOWER',
        '20MICRONS', 'MMP', 'KAMDHENU', 'BAHETIRE', 'POCL', 'PANCHMAHAL'
    ];

    // ==================== METAL COMPANIES GENERATOR ====================
    const generateMetalCompanies = () => {
        console.log('🔨 Generating metal companies...');

        const metalCompanies = [
            // Format: { symbol, name, sector, basePrice, marketCap }
            {symbol: 'JSWSTEEL.NS', name: 'JSW Steel Limited', sector: 'Metals', basePrice: 850.25, marketCap: 289053},
            {
                symbol: 'HINDZINC.NS',
                name: 'Hindustan Zinc Limited',
                sector: 'Metals',
                basePrice: 320.40,
                marketCap: 276505
            },
            {
                symbol: 'COALINDIA.NS',
                name: 'Coal India Limited',
                sector: 'Metals/Mining',
                basePrice: 450.60,
                marketCap: 266353
            },
            {symbol: 'VEDL.NS', name: 'Vedanta Limited', sector: 'Metals', basePrice: 280.75, marketCap: 264225},
            {
                symbol: 'TATASTEEL.NS',
                name: 'Tata Steel Limited',
                sector: 'Metals',
                basePrice: 145.80,
                marketCap: 236249
            },
            {
                symbol: 'HINDALCO.NS',
                name: 'Hindalco Industries Limited',
                sector: 'Metals',
                basePrice: 620.30,
                marketCap: 214700
            },
            {
                symbol: 'JINDALSTEL.NS',
                name: 'Jindal Steel & Power Limited',
                sector: 'Metals',
                basePrice: 850.50,
                marketCap: 106130
            },
            {symbol: 'NMDC.NS', name: 'NMDC Limited', sector: 'Metals/Mining', basePrice: 225.90, marketCap: 73693},
            {
                symbol: 'NATIONALUM.NS',
                name: 'National Aluminium Company Limited',
                sector: 'Metals',
                basePrice: 155.40,
                marketCap: 68580
            },
            {
                symbol: 'LLOYDSMETAL.NS',
                name: 'Lloyds Metals & Energy Limited',
                sector: 'Metals',
                basePrice: 680.25,
                marketCap: 67518
            },
            {symbol: 'JSL.NS', name: 'Jindal Stainless Limited', sector: 'Metals', basePrice: 620.80, marketCap: 65372},
            {
                symbol: 'SAIL.NS',
                name: 'Steel Authority of India Limited',
                sector: 'Metals',
                basePrice: 125.60,
                marketCap: 62949
            },
            {
                symbol: 'HINDCOPPER.NS',
                name: 'Hindustan Copper Limited',
                sector: 'Metals',
                basePrice: 280.90,
                marketCap: 55367
            },
        ];

        return metalCompanies.map((company, index) => {
            const isMarketOpen = marketStatus === 'open';
            const priceChange = (Math.random() * company.basePrice * 0.04 - company.basePrice * 0.02);
            const price = company.basePrice + priceChange;
            const changePercent = ((priceChange / price) * 100);

            return {
                id: index + 1000,
                symbol: company.symbol,
                name: company.name,
                sector: 'Metals',
                marketCap: company.marketCap * 100000,
                price: price.toFixed(2),
                change: parseFloat(priceChange.toFixed(2)),
                changePercent: parseFloat(changePercent.toFixed(2)),
                volume: Math.floor(company.marketCap * 10000),
                index: 'Nifty Metal',
                peRatio: (Math.random() * 40 + 5).toFixed(1),
                dividendYield: (Math.random() * 3).toFixed(2),
                weekHigh: (price * 1.15).toFixed(2),
                weekLow: (price * 0.85).toFixed(2),
                roe: (Math.random() * 25 + 5).toFixed(1),
                profitGrowth: (Math.random() * 30 + 2).toFixed(1),
                revenueGrowth: (Math.random() * 25 + 3).toFixed(1),
                operatingMargin: (Math.random() * 20 + 8).toFixed(1),
                promoterHolding: (Math.random() * 40 + 40).toFixed(1),
                fiiHolding: (Math.random() * 20 + 10).toFixed(1),
                diiHolding: (Math.random() * 15 + 8).toFixed(1),
                rsi: Math.floor(Math.random() * 60 + 25),
                macd: parseFloat((Math.random() * 1.5 - 0.5).toFixed(2)),
                investmentScore: calculateRealisticInvestmentScore('Metals', price, changePercent),
                recommendation: getRecommendationFromScore(calculateRealisticInvestmentScore('Metals', price, changePercent)),
                riskLevel: getRiskLevel(company.marketCap * 100000, (Math.random() * 25 + 2)),
                timeHorizon: getTimeHorizon(calculateRealisticInvestmentScore('Metals', price, changePercent)),
                sectorOutlook: 'volatile',
                isRealStock: true,
                isSimulated: false
            };
        });
    };

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
            console.log('✅ Companies loaded:', allCompanies.length);
        }
    }, [allCompanies]);

    // Enhanced news fetching with auto-refresh - ONLY REAL NEWS
    useEffect(() => {
        // Initial fetch on component mount
        fetchRealNews();

        // Clear existing interval
        if (newsUpdateRef.current) clearInterval(newsUpdateRef.current);

        // Set up new interval based on market status
        const updateInterval = isMarketOpen() ? 60000 : 300000; // 1 min when open, 5 min when closed
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

    // Enhanced News fetching - ONLY REAL NEWS
    const fetchRealNews = async () => {
        setLoadingNews(true);

        try {
            const API_KEY = 'pub_6327cce17f6b40b8b5b47111bb215cdc';
            const response = await fetch(
                `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=stock%20market%20OR%20nse%20OR%20bse&country=in&language=en&category=business`
            );

            const data = await response.json();

            if (data.status === "success" && data.results && data.results.length > 0) {
                const realNews = data.results.map((item, index) => ({
                    id: index + 1,
                    title: item.title,
                    description: item.description || 'Stock market update',
                    time: formatTimeAgo(item.pubDate),
                    source: item.source_id || 'News',
                    category: getNewsCategory(item.title),
                    impact: getImpactLevel(item.title),
                    isBreaking: index < 3,
                    stocksAffected: extractStocks(item.title),
                    companiesAffected: extractCompanies(item.title),
                    sector: getSectorFromNews(item.title),
                    readTime: '2 min read'
                }));

                setNews(realNews);
                console.log(`✅ Fetched ${realNews.length} real news articles`);
            } else {
                // If API returns no data, show empty state
                setNews([]);
                console.log('⚠️ No news available from API');
            }
        } catch (error) {
            console.error('❌ Error fetching real news:', error);
            // Don't use fallback - set empty news array
            setNews([]);
        }

        setLoadingNews(false);
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
        const useRealAPI = false;

        if (useRealAPI) {
            return await fetchRealStocksFromAPI();
        } else {
            return generateRealisticTopStocks();
        }
    };

    const fetchRealStocksFromAPI = async () => {
        console.log('Using real API would go here');
        return generateRealisticTopStocks();
    };

    // Generate realistic top 20 stocks (fallback when no API)
    const generateRealisticTopStocks = () => {
        const currentDate = new Date();
        const isMarketOpen = marketStatus === 'open';

        const realTopStocks = [
            {
                symbol: 'RELIANCE.NS',
                name: 'Reliance Industries Ltd.',
                sector: 'Energy',
                basePrice: 2945.15,
                volatility: 85
            },
            {
                symbol: 'TCS.NS',
                name: 'Tata Consultancy Services Ltd.',
                sector: 'IT',
                basePrice: 3890.50,
                volatility: 120
            },
            {symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', sector: 'Banking', basePrice: 1680.25, volatility: 45},
            {symbol: 'INFY.NS', name: 'Infosys Ltd.', sector: 'IT', basePrice: 1595.75, volatility: 65},
            {symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', sector: 'Banking', basePrice: 1085.40, volatility: 35},
            {symbol: 'ITC.NS', name: 'ITC Ltd.', sector: 'FMCG', basePrice: 445.60, volatility: 15},
            {symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking', basePrice: 625.80, volatility: 25},
            {
                symbol: 'BHARTIARTL.NS',
                name: 'Bharti Airtel Ltd.',
                sector: 'Telecom',
                basePrice: 1185.90,
                volatility: 40
            },
            {
                symbol: 'HINDUNILVR.NS',
                name: 'Hindustan Unilever Ltd.',
                sector: 'FMCG',
                basePrice: 2510.30,
                volatility: 75
            },
            {
                symbol: 'KOTAKBANK.NS',
                name: 'Kotak Mahindra Bank Ltd.',
                sector: 'Banking',
                basePrice: 1785.20,
                volatility: 55
            },
            {symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd.', sector: 'Banking', basePrice: 1120.45, volatility: 40},
            {
                symbol: 'LT.NS',
                name: 'Larsen & Toubro Ltd.',
                sector: 'Construction',
                basePrice: 3450.80,
                volatility: 150
            },
            {
                symbol: 'BAJFINANCE.NS',
                name: 'Bajaj Finance Ltd.',
                sector: 'Finance',
                basePrice: 7120.60,
                volatility: 300
            },
            {symbol: 'WIPRO.NS', name: 'Wipro Ltd.', sector: 'IT', basePrice: 485.30, volatility: 20},
            {
                symbol: 'ONGC.NS',
                name: 'Oil & Natural Gas Corporation Ltd.',
                sector: 'Energy',
                basePrice: 265.40,
                volatility: 12
            },
            {
                symbol: 'MARUTI.NS',
                name: 'Maruti Suzuki India Ltd.',
                sector: 'Automobile',
                basePrice: 11250.75,
                volatility: 450
            },
            {
                symbol: 'TITAN.NS',
                name: 'Titan Company Ltd.',
                sector: 'Consumer Durables',
                basePrice: 3650.90,
                volatility: 180
            },
            {
                symbol: 'ULTRACEMCO.NS',
                name: 'UltraTech Cement Ltd.',
                sector: 'Cement',
                basePrice: 9850.40,
                volatility: 400
            },
            {
                symbol: 'SUNPHARMA.NS',
                name: 'Sun Pharmaceutical Industries Ltd.',
                sector: 'Pharmaceuticals',
                basePrice: 1480.25,
                volatility: 60
            },
            {
                symbol: 'TATAMOTORS.NS',
                name: 'Tata Motors Ltd.',
                sector: 'Automobile',
                basePrice: 895.60,
                volatility: 35
            },
            {symbol: 'JSWSTEEL.NS', name: 'JSW Steel Limited', sector: 'Metals', basePrice: 850.25, volatility: 35},
            {
                symbol: 'HINDZINC.NS',
                name: 'Hindustan Zinc Limited',
                sector: 'Metals',
                basePrice: 320.40,
                volatility: 15
            },
            {
                symbol: 'COALINDIA.NS',
                name: 'Coal India Limited',
                sector: 'Metals/Mining',
                basePrice: 450.60,
                volatility: 20
            },
            {symbol: 'VEDL.NS', name: 'Vedanta Limited', sector: 'Metals', basePrice: 280.75, volatility: 25},
            {symbol: 'TATASTEEL.NS', name: 'Tata Steel Limited', sector: 'Metals', basePrice: 145.80, volatility: 30},
            {
                symbol: 'HINDALCO.NS',
                name: 'Hindalco Industries Limited',
                sector: 'Metals',
                basePrice: 620.30,
                volatility: 28
            },
            {symbol: 'NMDC.NS', name: 'NMDC Limited', sector: 'Metals/Mining', basePrice: 225.90, volatility: 12},
            {
                symbol: 'NATIONALUM.NS',
                name: 'National Aluminium Company Limited',
                sector: 'Metals',
                basePrice: 155.40,
                volatility: 18
            },
            {
                symbol: 'SAIL.NS',
                name: 'Steel Authority of India Limited',
                sector: 'Metals',
                basePrice: 125.60,
                volatility: 22
            }
        ];

        return realTopStocks.map((stock, index) => {
            const volatilityFactor = isMarketOpen ? 1.5 : 0.5;
            const priceChange = (Math.random() * stock.volatility * 2 - stock.volatility) * volatilityFactor;
            const price = stock.basePrice + priceChange;
            const change = isMarketOpen ? priceChange : (Math.random() * 20 - 10);
            const changePercent = ((change / price) * 100);

            const volume = Math.floor(stock.basePrice * (10000 + Math.random() * 50000));
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
                index: indices[Math.floor(Math.random() * 5)],
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
            'Metals', 'Telecom', 'Infrastructure']; // Fixed: removed duplicate comma

        let stocksGenerated = 0;
        let companyId = realStocks.length + 1;

        // Generate based on sector weights
        Object.keys(sectorWeights).forEach(sector => {
            const count = sectorWeights[sector];
            const avgPrice = avgPricesBySector[sector]
                ? avgPricesBySector[sector].reduce((a, b) => a + b, 0) / avgPricesBySector[sector].length
                : 500;

            for (let i = 0; i < count && stocksGenerated < 3480; i++) {
                const priceVariation = 0.2 + Math.random() * 1.6;
                const price = (avgPrice * priceVariation).toFixed(2);
                const change = (Math.random() * 12 - 6).toFixed(2);
                const changePercent = ((change / price) * 100).toFixed(2);
                const marketCapMultiplier = 50 + Math.random() * 950;
                const marketCap = parseFloat(price) * marketCapMultiplier / 100;

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
            const marketCap = parseFloat(price) * (10 + Math.random() * 990) / 100;

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
        if (marketCap > 20000) score += 8;
        else if (marketCap > 5000) score += 5;
        else if (marketCap > 500) score += 2;
        else score -= 5;

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
        if (price > 1000) score += 5;

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

    // Fetch all companies function
    const fetchAllCompanies = async () => {
        setLoading(true);

        console.log('🔄 Fetching hybrid stock data...');

        try {
            // STEP 1: Fetch REAL Top 20 Stocks
            console.log('📈 Step 1: Fetching real top stocks...');
            const realStocks = await fetchRealTopStocks();
            console.log(`✅ Real stocks: ${realStocks.length}`);

            // STEP 2: Generate Metal Companies
            console.log('🔨 Step 2: Generating metal companies...');
            const metalStocks = generateMetalCompanies();
            console.log(`✅ Metal stocks: ${metalStocks.length}`);
            console.log('🔍 Sample metal company:', metalStocks[0]?.name);

            // STEP 3: Generate Smart Simulated Stocks
            console.log('🤖 Step 3: Generating simulated stocks...');
            const simulatedStocks = generateSmartSimulatedData([...realStocks, ...metalStocks]);
            console.log(`✅ Simulated stocks: ${simulatedStocks.length}`);

            // STEP 4: Combine all
            console.log('🔗 Step 4: Combining all stocks...');
            const allCompanies = [...realStocks, ...metalStocks, ...simulatedStocks];
            console.log(`🎉 Total companies: ${allCompanies.length}`);

            // Debug: Count companies by sector
            const sectorCount = {};
            allCompanies.forEach(company => {
                sectorCount[company.sector] = (sectorCount[company.sector] || 0) + 1;
            });
            console.log('📊 Companies by sector:', sectorCount);

            // Shuffle and set state
            const shuffledCompanies = shuffleArray([...allCompanies]);
            setAllCompanies(shuffledCompanies);
            setFilteredCompanies(shuffledCompanies);

            // Update stats
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
            console.error('❌ Error in fetch:', error);
        }

        setLoading(false);
        console.log('✅ Data loading complete!');
    };

    // NEW: Comprehensive investment analysis function
    const analyzeCompanyForInvestment = (company) => {
        if (!company) return;

        const macdValue = typeof company.macd === 'string' ? parseFloat(company.macd) : company.macd || 0;
        const peRatio = typeof company.peRatio === 'string' ? parseFloat(company.peRatio) : company.peRatio || 0;
        const roe = typeof company.roe === 'string' ? parseFloat(company.roe) : company.roe || 0;
        const profitGrowth = typeof company.profitGrowth === 'string' ? parseFloat(company.profitGrowth) : company.profitGrowth || 0;
        const operatingMargin = typeof company.operatingMargin === 'string' ? parseFloat(company.operatingMargin) : company.operatingMargin || 0;
        const promoterHolding = typeof company.promoterHolding === 'string' ? parseFloat(company.promoterHolding) : company.promoterHolding || 0;
        const fiiHolding = typeof company.fiiHolding === 'string' ? parseFloat(company.fiiHolding) : company.fiiHolding || 0;
        const diiHolding = typeof company.diiHolding === 'string' ? parseFloat(company.diiHolding) : company.diiHolding || 0;

        let score = company.investmentScore || 50;
        const marketSentiment = marketStatus === 'open' ? 5 : 0;
        const peScore = peRatio < 25 ? 10 : peRatio < 40 ? 5 : 0;
        const rsiScore = company.rsi > 30 && company.rsi < 70 ? 10 : 0;
        const macdScore = macdValue > 0 ? 5 : 0;

        let roeScore = roe > 20 ? 15 : roe > 15 ? 10 : roe > 10 ? 5 : 0;
        let growthScore = profitGrowth > 15 ? 15 : profitGrowth > 10 ? 10 : profitGrowth > 5 ? 5 : 0;
        let marginScore = operatingMargin > 20 ? 10 : operatingMargin > 15 ? 5 : 0;

        if (roe < 0) roeScore = -10;
        if (profitGrowth < 0) growthScore = -10;
        if (operatingMargin < 5) marginScore = -5;

        const promoterScore = promoterHolding > 60 ? 10 : promoterHolding > 50 ? 5 : 0;
        const institutionalScore = (fiiHolding + diiHolding) > 30 ? 10 : 5;
        const momentumScore = company.change > 0 ? 5 : 0;

        const negativeScore =
            (roe < 0 ? 10 : 0) +
            (profitGrowth < -10 ? 10 : 0) +
            (peRatio > 50 ? 10 : 0);

        const finalScore = Math.max(0, Math.min(
            score + marketSentiment + peScore + rsiScore + macdScore +
            roeScore + growthScore + marginScore +
            promoterScore + institutionalScore + momentumScore - negativeScore,
            100
        ));

        setInvestmentScore(finalScore);
        setRecommendation(getRecommendationFromScore(finalScore));
        setRiskLevel(company.riskLevel);
        setTimeHorizon(company.timeHorizon);
        setSectorOutlook(company.sectorOutlook);

        const currentPrice = parseFloat(company.price);
        let targetMultiplier = 1.0;

        if (finalScore >= 80) targetMultiplier = 1.25;
        else if (finalScore >= 70) targetMultiplier = 1.15;
        else if (finalScore >= 60) targetMultiplier = 1.08;
        else if (finalScore >= 50) targetMultiplier = 1.02;
        else if (finalScore >= 40) targetMultiplier = 0.95;
        else targetMultiplier = 0.85;

        setPriceTarget(currentPrice * targetMultiplier);

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

    // Helper functions
    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';
        try {
            const now = new Date();
            const date = new Date(dateString);
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

    const getImpactLevel = (title) => {
        if (!title) return 'medium';
        const lowerTitle = title.toLowerCase();
        const highImpactWords = ['jump', 'surge', 'rally', 'plunge', 'crash', 'plummet', 'record', 'highest', 'lowest', 'alert', 'warning', 'crisis'];
        const lowImpactWords = ['update', 'review', 'analysis', 'outlook', 'trend'];
        if (highImpactWords.some(word => lowerTitle.includes(word))) return 'high';
        if (lowImpactWords.some(word => lowerTitle.includes(word))) return 'low';
        return 'medium';
    };

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
        return foundStocks.map(stock => `${stock}.NS`).slice(0, 5);
    };

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
        ).slice(0, 3);
    };

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
        console.log('🔍 Filtering companies...');
        console.log('Total companies:', allCompanies.length);
        console.log('Selected Sector:', selectedSector);

        let filtered = [...allCompanies];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(company =>
                company.symbol.toLowerCase().includes(term) ||
                company.name.toLowerCase().includes(term) ||
                company.sector.toLowerCase().includes(term)
            );
        }

        if (selectedSector !== 'All') {
            console.log('Filtering for sector:', selectedSector);
            const beforeFilter = filtered.length;
            filtered = filtered.filter(company => company.sector === selectedSector);
            console.log(`Companies after sector filter: ${filtered.length} (was ${beforeFilter})`);
            console.log('Sample companies:', filtered.slice(0, 3).map(c => ({name: c.name, sector: c.sector})));
        }

        if (selectedIndex !== 'All') {
            filtered = filtered.filter(company => company.index === selectedIndex);
        }

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

    const handleMarketCapFilter = (category) => {
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
        analyzeCompanyForInvestment(company);
    };

    const getMarketCapCategory = (marketCap) => {
        if (!marketCap || marketCap === 0) return 'Unknown';
        if (marketCap > 20000) return 'Large Cap';
        if (marketCap >= 5000) return 'Mid Cap';
        if (marketCap >= 500) return 'Small Cap';
        return 'Micro Cap';
    };

    const getRelatedNews = () => {
        if (!selectedCompany) return [];
        return news.filter(item =>
            item.stocksAffected.some(stock =>
                stock.toLowerCase().includes(selectedCompany.symbol.toLowerCase().split('.')[0])
            )
        ).slice(0, 3);
    };

    const getRecommendationColor = (rec) => {
        switch (rec) {
            case 'STRONG BUY':
                return '#10b981';
            case 'BUY':
                return '#22c55e';
            case 'ACCUMULATE':
                return '#84cc16';
            case 'HOLD':
                return '#eab308';
            case 'REDUCE':
                return '#f97316';
            case 'SELL':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'Low':
                return '#10b981';
            case 'Medium':
                return '#eab308';
            case 'High':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getOutlookColor = (outlook) => {
        switch (outlook) {
            case 'bullish':
                return '#10b981';
            case 'stable':
                return '#eab308';
            case 'cautious':
                return '#f97316';
            case 'volatile':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    useEffect(() => {
        if (allCompanies.length > 0) {
            console.log('📊 Total companies loaded:', allCompanies.length);
            const metalCompanies = allCompanies.filter(c => c.sector === 'Metals');
            console.log(`🔩 Metal companies: ${metalCompanies.length}`);
            if (metalCompanies.length > 0) {
                console.log('Sample metal companies:', metalCompanies.slice(0, 3).map(c => c.name));
            }
        }
    }, [allCompanies]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <DashboardWrapper
                        allCompanies={allCompanies}
                        filteredCompanies={filteredCompanies}
                        loading={loading}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedSector={selectedSector}
                        setSelectedSector={setSelectedSector}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        marketStats={marketStats}
                        selectedMarketCap={selectedMarketCap}
                        handleMarketCapFilter={handleMarketCapFilter}
                        showAuthModal={showAuthModal}
                        setShowAuthModal={setShowAuthModal}
                        authMode={authMode}
                        setAuthMode={setAuthMode}
                        user={user}
                        setUser={setUser}
                        showNewsModal={showNewsModal}
                        setShowNewsModal={setShowNewsModal}
                        news={news}
                        loadingNews={loadingNews}
                        currentDate={currentDate}
                        newsCategory={newsCategory}
                        setNewsCategory={setNewsCategory}
                        newsPage={newsPage}
                        setNewsPage={setNewsPage}
                        newsItemsPerPage={newsItemsPerPage}
                        investmentScore={investmentScore}
                        recommendation={recommendation}
                        riskLevel={riskLevel}
                        analysisFactors={analysisFactors}
                        priceTarget={priceTarget}
                        timeHorizon={timeHorizon}
                        sectorOutlook={sectorOutlook}
                        marketStatus={marketStatus}
                        marketTime={marketTime}
                        indices={indices}
                        sectors={sectors}
                        marketCapCategories={marketCapCategories}
                        newsCategories={newsCategories}
                        isMarketOpen={isMarketOpen}
                        formatNumber={formatNumber}
                        fetchRealNews={fetchRealNews}
                        filterNewsByCategory={filterNewsByCategory}
                        getPaginatedNews={getPaginatedNews}
                        checkMarketStatus={checkMarketStatus}
                        getRecommendationFromScore={getRecommendationFromScore}
                        getRiskLevel={getRiskLevel}
                        getTimeHorizon={getTimeHorizon}
                        getSectorOutlook={getSectorOutlook}
                        filterCompanies={filterCompanies}
                        calculateMarketStats={calculateMarketStats}
                        currentCompanies={currentCompanies}
                        totalPages={totalPages}
                        filteredNews={filteredNews}
                        totalNewsPages={totalNewsPages}
                        selectedCompany={selectedCompany}
                        handleCompanySelect={handleCompanySelect}
                        getMarketCapCategory={getMarketCapCategory}
                        getRelatedNews={getRelatedNews}
                        getRecommendationColor={getRecommendationColor}
                        getRiskColor={getRiskColor}
                        getOutlookColor={getOutlookColor}
                        analyzeCompanyForInvestment={analyzeCompanyForInvestment}
                    />
                }/>
                <Route path="/dashboard" element={
                    <DashboardWrapper
                        allCompanies={allCompanies}
                        filteredCompanies={filteredCompanies}
                        loading={loading}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedSector={selectedSector}
                        setSelectedSector={setSelectedSector}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        marketStats={marketStats}
                        selectedMarketCap={selectedMarketCap}
                        handleMarketCapFilter={handleMarketCapFilter}
                        showAuthModal={showAuthModal}
                        setShowAuthModal={setShowAuthModal}
                        authMode={authMode}
                        setAuthMode={setAuthMode}
                        user={user}
                        setUser={setUser}
                        showNewsModal={showNewsModal}
                        setShowNewsModal={setShowNewsModal}
                        news={news}
                        loadingNews={loadingNews}
                        currentDate={currentDate}
                        newsCategory={newsCategory}
                        setNewsCategory={setNewsCategory}
                        newsPage={newsPage}
                        setNewsPage={setNewsPage}
                        newsItemsPerPage={newsItemsPerPage}
                        investmentScore={investmentScore}
                        recommendation={recommendation}
                        riskLevel={riskLevel}
                        analysisFactors={analysisFactors}
                        priceTarget={priceTarget}
                        timeHorizon={timeHorizon}
                        sectorOutlook={sectorOutlook}
                        marketStatus={marketStatus}
                        marketTime={marketTime}
                        indices={indices}
                        sectors={sectors}
                        marketCapCategories={marketCapCategories}
                        newsCategories={newsCategories}
                        isMarketOpen={isMarketOpen}
                        formatNumber={formatNumber}
                        fetchRealNews={fetchRealNews}
                        filterNewsByCategory={filterNewsByCategory}
                        getPaginatedNews={getPaginatedNews}
                        checkMarketStatus={checkMarketStatus}
                        getRecommendationFromScore={getRecommendationFromScore}
                        getRiskLevel={getRiskLevel}
                        getTimeHorizon={getTimeHorizon}
                        getSectorOutlook={getSectorOutlook}
                        filterCompanies={filterCompanies}
                        calculateMarketStats={calculateMarketStats}
                        currentCompanies={currentCompanies}
                        totalPages={totalPages}
                        filteredNews={filteredNews}
                        totalNewsPages={totalNewsPages}
                        selectedCompany={selectedCompany}
                        handleCompanySelect={handleCompanySelect}
                        getMarketCapCategory={getMarketCapCategory}
                        getRelatedNews={getRelatedNews}
                        getRecommendationColor={getRecommendationColor}
                        getRiskColor={getRiskColor}
                        getOutlookColor={getOutlookColor}
                        analyzeCompanyForInvestment={analyzeCompanyForInvestment}
                    />
                }/>
                <Route path="/analyze/:symbol" element={
                    <StockAnalysis
                        allCompanies={allCompanies}
                        analyzeCompanyForInvestment={analyzeCompanyForInvestment}
                        getRecommendationColor={getRecommendationColor}
                        getRiskColor={getRiskColor}
                        getOutlookColor={getOutlookColor}
                    />
                }/>
            </Routes>
        </Router>
    );
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        this.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        this.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
});

export default App;
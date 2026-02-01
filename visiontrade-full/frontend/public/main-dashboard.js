// ==================== SECTOR CLASSIFICATION SYSTEM ====================
const SECTOR_MAPPING = {
    'Banking': ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK',
        'BANDHANBNK', 'IDFCFIRSTB', 'YESBANK', 'FEDERALBNK', 'RBLBANK', 'CUB',
        'SOUTHBANK', 'KARURVYSYA', 'J&KBANK', 'DCBBANK', 'CSBBANK', 'UCOBANK',
        'CENTRALBK', 'INDIANB', 'UNIONBANK', 'BANKBARODA', 'CANBK', 'PNB',
        'BANKINDIA', 'MAHABANK', 'UJJIVANSFB', 'AUBANK', 'EQUITAS'],

    'Finance': ['BAJFINANCE', 'BAJAJFINSV', 'CHOLAFIN', 'MUTHOOTFIN', 'MANAPPURAM',
        'PFC', 'RECLTD', 'HDFCAMC', 'ICICIPRULI', 'SBILIFE', 'HDFCLIFE',
        'ICICIGI', 'SHRIRAMCIT', 'BAJAJHLDNG', 'M&MFIN', 'IIFL', 'LICHSGFIN',
        'SUNDARMFIN', 'MASFIN', 'MOTILALOFS', 'EDELWEISS', 'JMCPROJECT'],

    'IT': ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM', 'LTIM', 'MPHASIS', 'LTI',
        'PERSISTENT', 'COFORGE', 'MINDTREE', 'LTTS', 'TATAELXSI', 'CYIENT',
        'ZENSARTECH', 'HEXAWARE', 'NIITTECH', 'SONATSOFTW', 'NEWGEN',
        'AFFLE', 'ROUTE', 'TANLA', 'INTELLECT', 'EASEMYTRIP', 'NAUKRI'],

    'Automobile': ['MARUTI', 'TATAMOTORS', 'M&M', 'BAJAJ-AUTO', 'HEROMOTOCO',
        'EICHERMOT', 'ASHOKLEY', 'TVSMOTOR', 'ESCORTS', 'BALKRISIND',
        'MRF', 'APOLLOTYRE', 'CEATLTD', 'JKTYRE', 'BHARATFORG', 'SONACOMS',
        'MOTHERSUMI', 'SUPRAJIT', 'SAMVARDHANA', 'BOSCHLTD', 'MOTHERSON'],

    'Pharma': ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'LUPIN', 'DIVISLAB', 'AUROPHARMA',
        'BIOCON', 'TORNTPHARM', 'ALKEM', 'GLENMARK', 'CADILAHC', 'IPCALAB',
        'LAURUSLABS', 'GRANULES', 'NATCOPHARM', 'AJANTPHARM', 'SANOFI',
        'PFIZER', 'ABBOTINDIA', 'GLAXO', 'NOVARTIND', 'ASTRAZEN', 'JBCHEPHARM'],

    'FMCG': ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'DABUR', 'GODREJCP',
        'MARICO', 'COLPAL', 'EMAMILTD', 'PGHH', 'PGHL', 'VBL', 'RADICO',
        'UNITEDSPR', 'UBL', 'MCDOWELL-N', 'JUBLFOOD', 'DMART'],

    'Energy': ['RELIANCE', 'ONGC', 'IOC', 'BPCL', 'HINDPETRO', 'GAIL', 'PETRONET',
        'GSPL', 'IGL', 'MGL', 'GUJGASLTD', 'ADANIGAS', 'ATGL', 'AEGISLOG',
        'NTPC', 'POWERGRID', 'TATAPOWER', 'ADANIPOWER', 'JSWENERGY', 'TORNTPOWER',
        'NHPC', 'SJVN', 'NLCINDIA', 'RECLTD', 'PFC'],

    'Metals': ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL', 'JINDALSTEL', 'SAIL',
        'NMDC', 'HINDCOPPER', 'NATIONALUM', 'HINDZINC', 'MOIL', 'APLAPOLLO',
        'RATNAMANI', 'MAITHANALL', 'SHYAMMETL', 'KIRLOSIND', 'MANAKALUCO'],

    'Infrastructure': ['LT', 'ADANIPORTS', 'IRB', 'GMRINFRA', 'PNCINFRA', 'NCC',
        'KEC', 'KALYANKJIL', 'POWERMECH', 'HGINFRA', 'GRINFRA',
        'ADANIGREEN', 'ADANITRANS', 'IRCON', 'RVNL', 'NBCC', 'GAYAPROJ',
        'ASHOKA', 'MBLINFRA', 'MEP'],

    'Telecom': ['BHARTIARTL', 'IDEA', 'MTNL', 'TATACOMM', 'ITI', 'HFCL',
        'TEJASNET', 'STERLITE', 'VODAFONE', 'INDUSTOWER', 'GTLINFRA'],

    'Real Estate': ['DLF', 'GODREJPROP', 'OBEROIRLTY', 'PRESTIGE', 'SUNTEK', 'BRIGADE',
        'MAHLIFE', 'SOBHA', 'PURVA', 'KOLTEPATIL', 'PHOENIXLTD', 'MINDSPACE',
        'LODHA', 'MEGASTAR', 'ARVIND', 'MAHLOG'],

    'Healthcare': ['APOLLOHOSP', 'FORTIS', 'NARAYANA', 'MAXHEALTH', 'HCG', 'KOVAI',
        'SHALBY', 'GLAND', 'ASTERDM', 'METROPOLIS', 'THYROCARE'],

    'Chemicals': ['UPL', 'PIDILITIND', 'SRF', 'TATACHEM', 'AARTIIND', 'DEEPAKNTR',
        'NAVINFLUOR', 'GUJALKALI', 'GNFC', 'FINEORG', 'PIIND', 'VINATIORGA',
        'SOLARINDS', 'ANUP', 'BALAMINES', 'ALKYLAMINE', 'CHEMCON', 'TATVA'],

    'Consumer Goods': ['TITAN', 'ASIANPAINT', 'BERGEPAINT', 'KANSAINER', 'AKZOINDIA',
        'HAVELLS', 'CROMPTON', 'BAJAJELEC', 'VGUARD', 'SYMPHONY', 'WHIRLPOOL',
        'BLUESTARCO', 'VOLTAS', 'TRENT'],

    'Oil & Gas': ['RELIANCE', 'ONGC', 'IOC', 'BPCL', 'HINDPETRO', 'GAIL', 'OIL',
        'PETRONET', 'AEGISLOG', 'GUJGAS', 'MGL', 'IGL', 'ADANIGAS',
        'ATGL', 'GSPL', 'LINDEINDIA', 'CHENNPETRO', 'MRPL'],

    'Cement': ['ULTRACEMCO', 'SHREECEM', 'ACC', 'AMBUJACEM', 'RAMCOCEM', 'DALBHARAT',
        'JKLAKSHMI', 'JKCEMENT', 'HEIDELBERG', 'BIRLACORPN', 'SAGCEM',
        'MANGALMCEM', 'KCP', 'BINANI', 'PRISMJOHNSON', 'NUVOCO'],

    'Textiles': ['ARVIND', 'KPRMILL', 'VARDHACRLC', 'TRIDENT', 'WELSPUNIND', 'ALOKTEXT',
        'BOMDYEING', 'SPENTEX', 'RUCHIRA', 'SUTLEJTEX', 'NAHARSPING', 'SANGAMIND',
        'GTNTEX', 'LOYALTEX', 'BANSWRAS', 'SURYALAXMI', 'PIONEEREMB'],

    'Media': ['ZEEL', 'SUNTV', 'DISHTV', 'TV18BRDCST', 'TVTODAY', 'NAZARA', 'INOXLEISUR',
        'PVRINOX', 'HATHWAY', 'DEN', 'SITI', 'BALAJITELE', 'SARE', 'ENIL',
        'MAGNUM', 'RADIOCITY', 'NDTV', 'NETWORK18'],

    'Agriculture': ['RALLIS', 'DCM', 'UPL', 'COROMANDEL', 'BAYERCROP', 'DEEPAKFERT',
        'GUJSTATE', 'CHAMBLFERT', 'GSFC', 'GNFC', 'FACT', 'RCF', 'NATIONALUM',
        'ZUARI', 'NFL', 'KHADIM', 'KAIRALI'],

    'Aviation': ['INDIGO', 'SPICEJET', 'GLOBALVECT', 'JETAIRWAYS', 'AIRINDIA'],

    'Retail': ['DMART', 'TRENT', 'V2RETAIL', 'VMART', 'SHOPERSTOP', 'SPENCERS',
        'AVENUE', 'PANTALOON', 'ARVINDFASN', 'BATAINDIA', 'LIBERTY',
        'METROBRAND', 'CANTABIL', 'TCNSBRANDS', 'GOCOLORS', 'MAX', 'VBL'],

    'Insurance': ['HDFCLIFE', 'SBILIFE', 'ICICIPRULI', 'MAXLIFE', 'LICI', 'ICICIGI',
        'GICRE', 'NIACL', 'NEWINDIA', 'BAJAJALLZ'],

    'Logistics': ['CONCOR', 'BLUEDART', 'TCI', 'GATI', 'VRL', 'MAHLOG', 'SNOWMAN',
        'DELHIVERY', 'CONTAINER', 'ALLCRGO'],

    'Power': ['NTPC', 'POWERGRID', 'TATAPOWER', 'ADANIPOWER', 'TORNTPOWER', 'JSWENERGY',
        'CESC', 'NHPC', 'SJVN', 'NLCINDIA', 'GIPCL', 'KPIGREEN', 'SUZLON'],

    'Defence': ['HAL', 'BEL', 'BDL', 'MIL', 'DATAPATTERNS', 'PARAS', 'ASTRA', 'MTAR'],

    'Railway': ['IRCON', 'RVNL', 'TEXRAIL', 'TITAGARH', 'JWL', 'CONCOR', 'RAILTEL'],

    'PSU': ['ONGC', 'NTPC', 'COALINDIA', 'IOC', 'BPCL', 'POWERGRID', 'GAIL', 'BHEL',
        'SAIL', 'HAL', 'BEL', 'MMTC', 'STC', 'NMDC', 'NLC', 'SJVN', 'NHPC']
};

// ==================== CONFIGURATION ====================
const CONFIG = {
    stocksPerPage: 25,
    updateInterval: 30000,
    initialLoadBatch: 100,
    maxStocksToLoad: 3500,
};

// ==================== STATE MANAGEMENT ====================
let allStocksData = [];
let displayedStocks = [];
let currentPage = 1;
let selectedSector = 'all';
let selectedMarketCap = 'all';
let selectedRisk = 'all';
let selectedPerformance = 'all';
let currentSort = 'market_cap_desc';
let searchQuery = '';
let sectorsDistribution = {};
let isLoading = true;

// ==================== REAL INDIAN STOCKS DATABASE ====================
const REAL_INDIAN_STOCKS = [
    // NIFTY 50 & Large Caps
    { symbol: 'RELIANCE', name: 'Reliance Industries Limited' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Limited' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited' },
    { symbol: 'INFY', name: 'Infosys Limited' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited' },
    { symbol: 'ITC', name: 'ITC Limited' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited' },
    { symbol: 'LT', name: 'Larsen & Toubro Limited' },
    { symbol: 'AXISBANK', name: 'Axis Bank Limited' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Limited' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited' },
    { symbol: 'TITAN', name: 'Titan Company Limited' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Limited' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Limited' },
    { symbol: 'NESTLEIND', name: 'Nestle India Limited' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Limited' },
    { symbol: 'WIPRO', name: 'Wipro Limited' },
    { symbol: 'M&M', name: 'Mahindra & Mahindra Limited' },
    { symbol: 'HCLTECH', name: 'HCL Technologies Limited' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Limited' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Limited' },
    { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Limited' },
    { symbol: 'NTPC', name: 'NTPC Limited' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Limited' },
    { symbol: 'JSWSTEEL', name: 'JSW Steel Limited' },
    { symbol: 'INDUSINDBK', name: 'IndusInd Bank Limited' },
    { symbol: 'TECHM', name: 'Tech Mahindra Limited' },
    { symbol: 'HINDALCO', name: 'Hindalco Industries Limited' },
    { symbol: 'COALINDIA', name: 'Coal India Limited' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises Limited' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Limited' },
    { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Limited' },
    { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Limited' },
    { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Limited' },
    { symbol: 'CIPLA', name: 'Cipla Limited' },
    { symbol: 'BRITANNIA', name: 'Britannia Industries Limited' },
    { symbol: 'EICHERMOT', name: 'Eicher Motors Limited' },
    { symbol: 'GRASIM', name: 'Grasim Industries Limited' },
    { symbol: 'SHREECEM', name: 'Shree Cement Limited' },
    { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Limited' },
    { symbol: 'TATACONSUM', name: 'Tata Consumer Products Limited' },
    { symbol: 'VEDL', name: 'Vedanta Limited' },
    { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited' },
    { symbol: 'IOC', name: 'Indian Oil Corporation Limited' },
    { symbol: 'HINDZINC', name: 'Hindustan Zinc Limited' },
    { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Limited' },
    // ... (continuing with rest of your stocks database - truncated for brevity)
];

// ==================== STOCK DATA GENERATION ====================
function categorizeStock(stockName, symbol) {
    const stockNameUpper = (stockName || '').toString().toUpperCase();
    const symbolUpper = (symbol || '').toString().toUpperCase();

    // 1️⃣ Exact symbol match first (fast & accurate)
    for (const [sector, symbols] of Object.entries(SECTOR_MAPPING)) {
        if (symbols.includes(symbolUpper)) {
            return sector;
        }
    }

    // 2️⃣ Keyword-based fallback
    if (stockNameUpper.includes('BANK')) return 'Banking';
    if (stockNameUpper.includes('FIN')) return 'Finance';
    if (stockNameUpper.includes('PHARMA') || stockNameUpper.includes('DRUG')) return 'Pharma';
    if (stockNameUpper.includes('TECH') || stockNameUpper.includes('SOFTWARE')) return 'IT';
    if (stockNameUpper.includes('AUTO') || stockNameUpper.includes('MOTOR')) return 'Automobile';
    if (stockNameUpper.includes('OIL') || stockNameUpper.includes('GAS')) return 'Oil & Gas';
    if (stockNameUpper.includes('POWER')) return 'Power';
    if (stockNameUpper.includes('STEEL') || stockNameUpper.includes('METAL')) return 'Metals';
    if (stockNameUpper.includes('CEMENT')) return 'Cement';
    if (stockNameUpper.includes('CHEM')) return 'Chemicals';
    if (stockNameUpper.includes('TEXTILE') || stockNameUpper.includes('FABRIC')) return 'Textiles';
    if (stockNameUpper.includes('REAL ESTATE') || stockNameUpper.includes('PROPERTY')) return 'Real Estate';
    if (stockNameUpper.includes('INFRA')) return 'Infrastructure';
    if (stockNameUpper.includes('RETAIL') || stockNameUpper.includes('MART')) return 'Retail';
    if (stockNameUpper.includes('MEDIA') || stockNameUpper.includes('TV')) return 'Media';
    if (stockNameUpper.includes('TELECOM')) return 'Telecom';
    if (stockNameUpper.includes('HEALTH') || stockNameUpper.includes('HOSPITAL')) return 'Healthcare';
    if (stockNameUpper.includes('AGRI') || stockNameUpper.includes('FERTILIZER')) return 'Agriculture';
    if (stockNameUpper.includes('AIR') || stockNameUpper.includes('AVIATION')) return 'Aviation';
    if (stockNameUpper.includes('INSURANCE')) return 'Insurance';
    if (stockNameUpper.includes('LOGISTICS') || stockNameUpper.includes('TRANSPORT')) return 'Logistics';
    if (stockNameUpper.includes('DEFENCE') || stockNameUpper.includes('MILITARY')) return 'Defence';
    if (stockNameUpper.includes('RAIL')) return 'Railway';

    // 3️⃣ PSU fallback
    const psuKeywords = ['INDIA', 'CORPORATION', 'AUTHORITY', 'BOARD'];
    if (psuKeywords.some(k => stockNameUpper.includes(k))) {
        return 'PSU';
    }

    // 4️⃣ Final fallback
    return 'Other';
}

function getSectorColorClass(sector) {
    const sectorMap = {
        'Banking': 'sector-banking',
        'Finance': 'sector-finance',
        'IT': 'sector-it',
        'Automobile': 'sector-automobile',
        'Pharma': 'sector-pharma',
        'FMCG': 'sector-fmcg',
        'Energy': 'sector-energy',
        'Metals': 'sector-metals',
        'Infrastructure': 'sector-infrastructure',
        'Telecom': 'sector-telecom',
        'Real Estate': 'sector-real-estate',
        'Healthcare': 'sector-healthcare',
        'Chemicals': 'sector-chemicals',
        'Consumer Goods': 'sector-consumer-goods',
        'Oil & Gas': 'sector-oil-gas',
        'Cement': 'sector-cement',
        'Textiles': 'sector-textiles',
        'Media': 'sector-media',
        'Agriculture': 'sector-agriculture',
        'Aviation': 'sector-aviation',
        'Retail': 'sector-retail',
        'Insurance': 'sector-insurance',
        'Logistics': 'sector-logistics',
        'Power': 'sector-power',
        'Defence': 'sector-defence',
        'Railway': 'sector-railway',
        'PSU': 'sector-psu'
    };

    return sectorMap[sector] || 'sector-other';
}

function generateStockData(count = 3500) {
    const stocks = [];

    // First, add all real stocks
    REAL_INDIAN_STOCKS.forEach((stockData, index) => {
        const sector = categorizeStock(stockData.name, stockData.symbol);
        const marketCapValue = generateMarketCap(index);
        const marketCapType = getMarketCapType(marketCapValue);
        const riskLevel = getRiskLevel(marketCapType);
        const basePrice = generateInitialPrice(stockData.symbol);
        const change = (Math.random() - 0.5) * 100;
        const changePercent = (change / basePrice) * 100;
        const price = basePrice + change;

        stocks.push({
            id: `stock-${index}`,
            symbol: stockData.symbol,
            name: stockData.name,
            sector,
            marketCap: marketCapValue,
            marketCapType,
            riskLevel,
            price: Math.max(1, price),
            previousClose: basePrice,
            change: change,
            changePercent: changePercent,
            volume: Math.floor(Math.random() * 10000000),
            recommendation: getRecommendation(changePercent, riskLevel),
            lastUpdated: new Date(),
            isLive: false
        });

        sectorsDistribution[sector] = (sectorsDistribution[sector] || 0) + 1;
    });

    // Then generate additional synthetic stocks to reach target count
    const remainingCount = count - REAL_INDIAN_STOCKS.length;
    const companyPrefixes = ['Aditya', 'Alok', 'Ambuja', 'Anil', 'Anmol', 'Arvind', 'Ashok', 'Bajrang',
        'Balaji', 'Bharat', 'Birla', 'Chandra', 'Continental', 'Deepak', 'Dewan', 'Dilip'];

    const companySuffixes = ['Industries', 'Limited', 'Corporation', 'Enterprises', 'Group',
        'Solutions', 'Technologies', 'Systems', 'Services', 'Holdings', 'Ventures'];

    for (let i = 0; i < remainingCount; i++) {
        const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
        const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
        const companyName = `${prefix} ${suffix}`;
        const symbol = generateSymbol(companyName, i + REAL_INDIAN_STOCKS.length);

        const sector = categorizeStock(companyName, symbol);
        const marketCapValue = generateMarketCap(i + REAL_INDIAN_STOCKS.length);
        const marketCapType = getMarketCapType(marketCapValue);
        const riskLevel = getRiskLevel(marketCapType);
        const basePrice = generateInitialPrice(symbol);
        const change = (Math.random() - 0.5) * 100;
        const changePercent = (change / basePrice) * 100;
        const price = basePrice + change;

        stocks.push({
            id: `stock-${i + REAL_INDIAN_STOCKS.length}`,
            symbol: symbol,
            name: companyName,
            sector,
            marketCap: marketCapValue,
            marketCapType,
            riskLevel,
            price: Math.max(1, price),
            previousClose: basePrice,
            change: change,
            changePercent: changePercent,
            volume: Math.floor(Math.random() * 10000000),
            recommendation: getRecommendation(changePercent, riskLevel),
            lastUpdated: new Date(),
            isLive: false
        });

        sectorsDistribution[sector] = (sectorsDistribution[sector] || 0) + 1;
    }

    return stocks;
}

function generateSymbol(companyName, index) {
    const words = companyName.split(' ');
    let symbol = '';

    for (const word of words) {
        if (word.length > 0 && symbol.length < 10) {
            symbol += word.charAt(0).toUpperCase();
        }
    }

    if (symbol.length < 3) {
        symbol += (index % 1000).toString().padStart(3, '0');
    }

    return symbol;
}

function generateMarketCap(index) {
    // Large Cap: ₹20,000 Cr – ₹2,00,000 Cr
    if (index < 50)
        return Math.random() * 1_800_000_000_000 + 200_000_000_000;

    // Mid Cap: ₹5,000 Cr – ₹20,000 Cr
    if (index < 150)
        return Math.random() * 150_000_000_000 + 50_000_000_000;

    // Small Cap: ₹500 Cr – ₹5,000 Cr
    if (index < 500)
        return Math.random() * 45_000_000_000 + 5_000_000_000;

    // Micro Cap: < ₹500 Cr
    return Math.random() * 5_000_000_000 + 50_000_000;
}



function generateInitialPrice(symbol) {
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 5000) + 100;
}

function getMarketCapType(marketCap) {
    // marketCap is already in RUPEES
    if (marketCap >= 200_000_000_000) return 'large'; // ≥ ₹20,000 Cr
    if (marketCap >= 50_000_000_000)  return 'mid';   // ≥ ₹5,000 Cr
    if (marketCap >= 5_000_000_000)   return 'small'; // ≥ ₹500 Cr
    return 'micro';
}



function getRiskLevel(marketCapType) {
    switch(marketCapType) {
        case 'large': return 'low';
        case 'mid': return 'medium';
        default: return 'high';
    }
}

function getRecommendation(changePercent, riskLevel) {
    let recommendation;

    if (changePercent > 5) {
        recommendation = riskLevel === 'high' ? 'Buy' : 'Strong Buy';
    } else if (changePercent > 2) {
        recommendation = 'Buy';
    } else if (changePercent > -2) {
        recommendation = 'Hold';
    } else if (changePercent > -5) {
        recommendation = 'Sell';
    } else {
        recommendation = riskLevel === 'high' ? 'Strong Sell' : 'Sell';
    }

    const classes = {
        'Strong Buy': 'recommendation-strong-buy',
        'Buy': 'recommendation-buy',
        'Hold': 'recommendation-hold',
        'Sell': 'recommendation-sell',
        'Strong Sell': 'recommendation-strong-sell'
    };

    return {
        text: recommendation,
        class: classes[recommendation]
    };
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Indian Stocks Dashboard...');
    showLoadingState();

    try {
        // Check backend connection first
        try {
            const healthCheck = await fetch('http://localhost:3000/api/stock?symbol=TCS');
            if (!healthCheck.ok) {
                throw new Error('Backend not responding');
            }
            console.log('✅ Backend server connected');
        } catch (backendError) {
            console.error('❌ Backend server not running!');
            document.getElementById('loadingProgress').innerHTML = `
                <div class="text-red-400 font-bold mb-2">⚠️ Backend Server Not Running</div>
                <div class="text-sm text-gray-400">Please start your backend server:</div>
                <div class="text-sm text-blue-400 mt-2 font-mono">
                    cd visiontrade-full<br>
                    node server.js
                </div>
                <div class="text-sm text-gray-500 mt-2">Then refresh this page</div>
            `;
            return;
        }

        await loadMarketIndices();
        await loadAllStocks();
        initializeFilters();
        startAutoRefresh();
        hideLoadingState();
        console.log('✅ Dashboard initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        document.getElementById('loadingProgress').textContent = 'Error: ' + error.message;
    }
});

async function loadAllStocks() {
    console.log('📥 Generating stock data...');

    allStocksData = generateStockData(3500);

    updateSectorChips();
    updateMarketCapCounts();
    applyFiltersAndRender();

    document.getElementById('totalStocks').textContent = allStocksData.length.toLocaleString();
    document.getElementById('liveStocksCount').textContent = '0';

    console.log('✅ Loaded', allStocksData.length, 'stocks');
    console.log('💰 Fetching real prices from Yahoo Finance...');

    await fetchRealPricesInBatches();
}

async function fetchRealPricesInBatches() {
    const batchSize = 10;
    let liveCount = 0;

    const realStockSymbols = REAL_INDIAN_STOCKS.map(s => s.symbol);
    const realStocks = allStocksData.filter(s => realStockSymbols.includes(s.symbol));

    console.log(`🔍 Fetching real prices for ${realStocks.length} stocks from backend...`);

    for (let i = 0; i < realStocks.length; i += batchSize) {
        const batch = realStocks.slice(i, i + batchSize);

        await Promise.all(batch.map(async (stock) => {
            try {
                const response = await fetch(`http://localhost:3000/api/stock?symbol=${stock.symbol}`);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data && data.price && data.price > 0) {
                    const previousClose = data.price / (1 + (data.change / 100));

                    stock.price = data.price;
                    stock.previousClose = previousClose;
                    stock.change = data.price - previousClose;
                    stock.changePercent = data.change;
                    if (data.marketCap) {
                        stock.marketCap = data.marketCap;
                        stock.marketCapType = getMarketCapType(stock.marketCap);
                        stock.riskLevel = getRiskLevel(stock.marketCapType);
                    }

                    stock.peRatio = data.pe || null;
                    stock.recommendation = getRecommendation(stock.changePercent, stock.riskLevel);
                    stock.isLive = true;

                    liveCount++;

                    console.log(`✅ ${stock.symbol}: ₹${stock.price.toFixed(2)} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to fetch ${stock.symbol}: ${error.message}`);
            }
        }));

        document.getElementById('liveStocksCount').textContent = liveCount;
        if (i === 0) {
            applyFiltersAndRender();
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        const progress = Math.min(100, Math.round((i + batchSize) / realStocks.length * 100));
        document.getElementById('loadingProgress').textContent =
            `Fetching real prices: ${liveCount}/${realStocks.length} stocks (${progress}%)`;
    }

    console.log(`✅ Successfully fetched ${liveCount} real stock prices`);
    applyFiltersAndRender();
}

async function loadMarketIndices() {
    try {
        try {
            const niftyResponse = await fetch('http://localhost:3000/api/stock?symbol=NSEI');
            if (niftyResponse.ok) {
                const niftyData = await niftyResponse.json();
                const previousClose = niftyData.price / (1 + (niftyData.change / 100));
                updateIndexDisplay('nifty', niftyData.price, previousClose);
            } else {
                throw new Error('NIFTY fetch failed');
            }
        } catch (niftyError) {
            console.warn('⚠️ NIFTY fetch failed');
            const niftyValue = 23800;
            updateIndexDisplay('nifty', niftyValue, 23700);
        }

        try {
            const sensexResponse = await fetch('http://localhost:3000/api/stock?symbol=SENSEX');
            if (sensexResponse.ok) {
                const sensexData = await sensexResponse.json();
                const previousClose = sensexData.price / (1 + (sensexData.change / 100));
                updateIndexDisplay('sensex', sensexData.price, previousClose);
            } else {
                throw new Error('SENSEX fetch failed');
            }
        } catch (sensexError) {
            console.warn('⚠️ SENSEX fetch failed');
            const sensexValue = 78600;
            updateIndexDisplay('sensex', sensexValue, 78400);
        }

        updateMarketStatus();
        updateLastUpdated();
    } catch (error) {
        console.error('Error loading market indices:', error);
        updateIndexDisplay('nifty', 23800, 23700);
        updateIndexDisplay('sensex', 78600, 78400);
    }
}

function updateIndexDisplay(index, currentPrice, previousClose) {
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    const isPositive = change >= 0;

    const formattedPrice = index === 'sensex'
        ? currentPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})
        : currentPrice.toFixed(2);

    const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(2)} (${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)`;

    document.getElementById(`${index}Value`).textContent = formattedPrice;
    document.getElementById(`${index}Change`).innerHTML = `
        <span class="${isPositive ? 'text-green-400' : 'text-red-400'} font-semibold">
            ${formattedChange}
        </span>
    `;
    document.getElementById(`${index}Status`).innerHTML = `
        <i class="fas fa-circle text-green-400 mr-1"></i> Live
    `;
}

// ==================== UI RENDERING ====================
function createStockRow(stock, index) {
    const row = document.createElement('tr');
    row.className = 'stock-row border-b border-gray-700 hover:bg-gray-750';

    const marketCapFormatted = formatMarketCap(stock.marketCap);
    const marketCapClass = getMarketCapClass(stock.marketCapType);
    const sectorColorClass = getSectorColorClass(stock.sector);

    row.innerHTML = `
        <td class="py-4 px-6 sticky left-0 bg-gray-800 z-10">
            <div class="flex items-center">
                <div class="w-10 h-10 rounded-lg ${sectorColorClass} border flex items-center justify-center mr-3">
                    <span class="font-bold text-white">${stock.symbol.charAt(0)}</span>
                </div>
                <div>
                    <div class="flex items-center">
                        <span class="font-bold text-white mr-2">${stock.symbol}</span>
                    </div>
                    <div class="text-sm text-gray-400 truncate max-w-[200px]">${stock.name}</div>
                </div>
            </div>
        </td>
        <td class="py-4 px-6">
            <div class="${sectorColorClass} px-3 py-1 rounded-full text-xs font-semibold inline-block border">
                ${stock.sector}
            </div>
        </td>
        <td class="py-4 px-6">
            <div class="${marketCapClass} inline-block">${marketCapFormatted}</div>
            <div class="text-xs text-gray-500 mt-1">${stock.marketCapType.toUpperCase()} CAP</div>
        </td>
        <td class="py-4 px-6">
            <span class="${stock.recommendation.class}">${stock.recommendation.text}</span>
        </td>
        <td class="py-4 px-6">
            <span class="${stock.riskLevel === 'low' ? 'risk-low' : stock.riskLevel === 'medium' ? 'risk-medium' : 'risk-high'}">
                ${stock.riskLevel.toUpperCase()}
            </span>
        </td>
        <td class="py-4 px-6">
            <div class="font-bold text-white stock-price">₹${formatNumber(stock.price)}</div>
            <div class="text-sm ${stock.change >= 0 ? 'positive-change' : 'negative-change'}">
                ${stock.change >= 0 ? '+' : ''}₹${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)
            </div>
        </td>
        <td class="py-4 px-6 sticky right-0 bg-gray-800 z-10">
            <div class="flex gap-2">
                <button onclick="analyzeStock('${stock.symbol}')"
                    class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex-1">
                    <i class="fas fa-chart-bar mr-1"></i> Analyze
                </button>
                <button onclick="predictStock('${stock.symbol}')" id="predict-btn-${stock.symbol}"
                    class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex-1">
                    <i class="fas fa-brain mr-1"></i> Predict
                </button>
            </div>
        </td>
    `;

    return row;
}

function getMarketCapClass(type) {
    const classes = {
        'large': 'large-cap',
        'mid': 'mid-cap',
        'small': 'small-cap',
        'micro': 'micro-cap'
    };
    return classes[type] || 'large-cap';
}

function formatMarketCap(value) {
    if (value >= 100000000000) return '₹' + (value / 100000000000).toFixed(1) + 'L Cr';
    if (value >= 10000000000) return '₹' + (value / 10000000000).toFixed(1) + 'K Cr';
    if (value >= 1000000000) return '₹' + (value / 1000000000).toFixed(1) + ' Cr';
    if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + ' L';
    return '₹' + (value / 100000).toFixed(1) + ' K';
}

function formatNumber(num) {
    return num.toFixed(2);
}

// ==================== PREDICT FUNCTION ====================
window.predictStock = async function(symbol) {
    const button = document.getElementById(`predict-btn-${symbol}`);
    const originalHTML = button.innerHTML;

    button.disabled = true;
    button.innerHTML = '<span class="predict-loader"></span> Predicting...';

    try {
        const stock = allStocksData.find(s => s.symbol === symbol);

        if (!stock) {
            alert('Stock data not found');
            return;
        }

        console.log(`🔮 Generating predictions for ${symbol}...`);

        // Call the prediction API
        const response = await fetch(`http://localhost:3000/api/predict?symbol=${symbol}`);

        if (!response.ok) {
            throw new Error(`Prediction API returned ${response.status}`);
        }

        const predictionData = await response.json();

        // Store prediction data in sessionStorage
        sessionStorage.setItem('predictionData', JSON.stringify({
            symbol: stock.symbol,
            name: stock.name,
            currentPrice: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            marketCap: stock.marketCap,
            sector: stock.sector,
            predictions: predictionData.predictions,
            lstm: predictionData.lstm,
            linearRegression: predictionData.linearRegression,
            confidence: predictionData.confidence,
            timestamp: new Date().toISOString()
        }));

        // Redirect to prediction page
        window.location.href = 'predict.html';

    } catch (error) {
        console.error('Prediction error:', error);
        alert(`Error generating predictions: ${error.message}\n\nMake sure your backend server is running with the /api/predict endpoint.`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalHTML;
    }
};

// ==================== ANALYZE FUNCTION ====================
window.analyzeStock = function(symbol) {
    const stock = allStocksData.find(s => s.symbol === symbol);

    if (!stock) {
        alert('Stock data not found');
        return;
    }

    sessionStorage.setItem('analyzingStock', JSON.stringify({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        marketCap: stock.marketCap,
        peRatio: (Math.random() * 30 + 5).toFixed(1),
        recommendation: stock.recommendation,
        riskLevel: {
            text: stock.riskLevel.toUpperCase(),
            class: stock.riskLevel === 'low'
                ? 'risk-low'
                : stock.riskLevel === 'medium'
                    ? 'risk-medium'
                    : 'risk-high'
        }
    }));

    window.location.href = 'analyze.html';
};

// ==================== FILTERING & RENDERING ====================
function applyFiltersAndRender() {
    if (allStocksData.length === 0) {
        showEmptyState();
        return;
    }

    displayedStocks = allStocksData.filter(stock => {
        if (selectedMarketCap !== 'all' && stock.marketCapType !== selectedMarketCap) return false;
        if (selectedSector !== 'all' && stock.sector !== selectedSector) return false;
        if (selectedRisk !== 'all' && stock.riskLevel !== selectedRisk) return false;

        if (selectedPerformance !== 'all') {
            if (selectedPerformance === 'gainers' && stock.changePercent <= 0) return false;
            if (selectedPerformance === 'losers' && stock.changePercent >= 0) return false;
            if (selectedPerformance === 'active' && stock.volume < 1000000) return false;
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!stock.symbol.toLowerCase().includes(query) &&
                !stock.name.toLowerCase().includes(query) &&
                !stock.sector.toLowerCase().includes(query)) {
                return false;
            }
        }

        return true;
    });

    applySorting();
    updateTableInfo();
    renderStocksTable();
}

function applySorting() {
    switch(currentSort) {
        case 'market_cap_desc':
            displayedStocks.sort((a, b) => b.marketCap - a.marketCap);
            break;
        case 'market_cap_asc':
            displayedStocks.sort((a, b) => a.marketCap - b.marketCap);
            break;
        case 'change_desc':
            displayedStocks.sort((a, b) => b.changePercent - a.changePercent);
            break;
        case 'change_asc':
            displayedStocks.sort((a, b) => a.changePercent - b.changePercent);
            break;
        case 'price_desc':
            displayedStocks.sort((a, b) => b.price - a.price);
            break;
        case 'price_asc':
            displayedStocks.sort((a, b) => a.price - b.price);
            break;
        case 'name_asc':
            displayedStocks.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            displayedStocks.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
}

function renderStocksTable() {
    const tbody = document.getElementById('stocksTableBody');

    if (displayedStocks.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();

    const startIndex = (currentPage - 1) * CONFIG.stocksPerPage;
    const endIndex = startIndex + CONFIG.stocksPerPage;
    const pageStocks = displayedStocks.slice(startIndex, endIndex);

    tbody.innerHTML = '';

    pageStocks.forEach((stock, index) => {
        const row = createStockRow(stock, startIndex + index + 1);
        tbody.appendChild(row);
    });

    updatePagination();
}

// ==================== UI STATE MANAGEMENT ====================
function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('emptyState').classList.add('hidden');
    isLoading = true;
}

function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
    isLoading = false;
}

function showEmptyState() {
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('stocksTableBody').innerHTML = '';
    document.getElementById('loadingState').classList.add('hidden');
}

function hideEmptyState() {
    document.getElementById('emptyState').classList.add('hidden');
}

function updateTableInfo() {
    const total = displayedStocks.length;
    const start = Math.min((currentPage - 1) * CONFIG.stocksPerPage + 1, total);
    const end = Math.min(currentPage * CONFIG.stocksPerPage, total);

    document.getElementById('tableSubtitle').textContent =
        `Showing ${start}-${end} of ${total.toLocaleString()} stocks`;

    let title = 'All Stocks';
    if (selectedSector !== 'all') title = `${selectedSector} Stocks`;
    if (selectedMarketCap !== 'all') title = `${selectedMarketCap.charAt(0).toUpperCase() + selectedMarketCap.slice(1)} Cap Stocks`;
    document.getElementById('tableTitle').textContent = title;

    document.getElementById('searchResultsCount').textContent = total.toLocaleString();
}

// ==================== SECTOR MANAGEMENT ====================
function updateSectorChips() {
    const container = document.getElementById('sectorsContainer');
    const moreContainer = document.getElementById('moreSectors');

    container.innerHTML = '<div class="sector-chip px-4 py-2 rounded-full border border-blue-600 text-blue-400 bg-blue-900/20 active" onclick="filterBySector(\'all\')">All Sectors</div>';
    moreContainer.innerHTML = '';

    const sectorsWithStocks = Object.entries(sectorsDistribution)
        .filter(([sector, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);

    sectorsWithStocks.forEach(([sector, count], index) => {
        const chip = document.createElement('div');
        const sectorClass = getSectorColorClass(sector);

        chip.className = `${sectorClass} sector-chip px-4 py-2 rounded-full text-gray-300 hover:text-white cursor-pointer border`;
        chip.innerHTML = `
            <span class="font-medium">${sector}</span>
            <span class="text-xs bg-gray-800 rounded-full px-2 py-0.5 ml-2">${count}</span>
        `;

        chip.addEventListener('click', () => filterBySector(sector));

        if (index < 8) {
            container.appendChild(chip);
        } else {
            moreContainer.appendChild(chip);
        }
    });

    const totalSectors = sectorsWithStocks.length;
    document.getElementById('sectorsCount').textContent = `2`;
    document.getElementById('sectorCount').textContent = `${totalSectors} sectors identified`;
}

function updateMarketCapCounts() {
    const counts = {
        all: allStocksData.length,
        large: allStocksData.filter(s => s.marketCapType === 'large').length,
        mid: allStocksData.filter(s => s.marketCapType === 'mid').length,
        small: allStocksData.filter(s => s.marketCapType === 'small' || s.marketCapType === 'micro').length
    };

    document.getElementById('capCountAll').textContent = counts.all.toLocaleString() + '+';
    document.getElementById('capCountLarge').textContent = counts.large.toLocaleString() + '+';
    document.getElementById('capCountMid').textContent = counts.mid.toLocaleString() + '+';
    document.getElementById('capCountSmall').textContent = counts.small.toLocaleString() + '+';
}

// ==================== EVENT HANDLERS ====================
function setupEventListeners() {
    document.getElementById('searchStocks').addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            currentPage = 1;
            applyFiltersAndRender();
        }, 300);
    });

    document.getElementById('sortBy').addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndRender();
    });

    document.getElementById('riskFilter').addEventListener('change', (e) => {
        selectedRisk = e.target.value;
        applyFiltersAndRender();
    });

    document.getElementById('performanceFilter').addEventListener('change', (e) => {
        selectedPerformance = e.target.value;
        applyFiltersAndRender();
    });

    document.getElementById('toggleSectors').addEventListener('click', function() {
        const moreSectors = document.getElementById('moreSectors');
        const isHidden = moreSectors.classList.contains('hidden');

        if (isHidden) {
            moreSectors.classList.remove('hidden');
            moreSectors.classList.add('flex');
            this.innerHTML = '<i class="fas fa-chevron-up mr-1"></i> Show Less';
        } else {
            moreSectors.classList.add('hidden');
            moreSectors.classList.remove('flex');
            this.innerHTML = '<i class="fas fa-chevron-down mr-1"></i> Show All Sectors';
        }
    });

    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
}

// ==================== FILTER FUNCTIONS ====================
window.filterBySector = function(sector) {
    selectedSector = sector === 'all' ? 'all' : sector;

    document.querySelectorAll('.sector-chip').forEach(chip => {
        chip.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600');

        const chipText = chip.textContent.trim();
        if ((sector === 'all' && chipText.includes('All Sectors')) || chipText.includes(sector)) {
            chip.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600');
        }
    });

    currentPage = 1;
    applyFiltersAndRender();
}

window.filterByMarketCap = function(capType) {
    selectedMarketCap = capType;

    document.querySelectorAll('.market-cap-chip').forEach(chip => {
        chip.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600');
    });

    const activeChip = document.getElementById(`marketCap${capType.charAt(0).toUpperCase() + capType.slice(1)}`);
    if (activeChip) {
        activeChip.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600');
    }

    currentPage = 1;
    applyFiltersAndRender();
}

// ==================== PAGINATION ====================
function updatePagination() {
    const totalPages = Math.ceil(displayedStocks.length / CONFIG.stocksPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;

    pageNumbers.innerHTML = '';

    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-1 rounded-lg ${i === currentPage ? 'pagination-btn active' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`;
        pageButton.textContent = i;
        pageButton.onclick = () => changePage(i);
        pageNumbers.appendChild(pageButton);
    }

    document.getElementById('paginationInfo').innerHTML = `
        Page <span class="text-white font-semibold">${currentPage}</span> of
        <span class="text-white font-semibold">${totalPages}</span> •
        <span class="text-gray-400">${displayedStocks.length.toLocaleString()} stocks</span>
    `;
}

window.changePage = function(page) {
    const totalPages = Math.ceil(displayedStocks.length / CONFIG.stocksPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderStocksTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.refreshAllData = async function() {
    console.log('🔄 Refreshing data...');
    document.getElementById('loadingProgress').textContent = 'Refreshing prices...';
    showLoadingState();

    await loadMarketIndices();
    await fetchRealPricesInBatches();
    updateLastUpdated();
    updateMarketCapCounts();

    hideLoadingState();
    console.log('✅ Refresh complete');
};

// ==================== AUTO REFRESH ====================
function startAutoRefresh() {
    setInterval(async () => {
        await loadMarketIndices();
    }, 10000);

    setInterval(async () => {
        if (!isLoading) {
            console.log('🔄 Auto-refreshing prices...');
            const liveStocks = allStocksData.filter(s => s.isLive);

            const batch = liveStocks.slice(0, 20);
            await Promise.all(batch.map(async (stock) => {
                try {
                    const response = await fetch(`http://localhost:3000/api/stock?symbol=${stock.symbol}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.price && data.price > 0) {
                            stock.price = data.price;
                            stock.change = stock.price - stock.previousClose;
                            stock.changePercent = (stock.change / stock.previousClose) * 100;
                            stock.recommendation = getRecommendation(stock.changePercent, stock.riskLevel);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to refresh ${stock.symbol}`);
                }
            }));

            if (displayedStocks.length > 0) {
                renderStocksTable();
            }
        }
    }, 300000);

    setInterval(() => {
        if (!isLoading) {
            updateLastUpdated();
        }
    }, 1000);
}

function updateMarketStatus() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isMarketOpen = (hours >= 9 && hours < 15) || (hours === 15 && minutes <= 30);

    const marketStatus = isMarketOpen ? 'OPEN' : 'CLOSED';
    document.getElementById('marketStatus').textContent = marketStatus;
    document.getElementById('marketStatus').className = marketStatus === 'OPEN'
        ? 'text-lg font-bold text-green-400'
        : 'text-lg font-bold text-red-400';
}

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('lastUpdated').innerHTML = `
        <i class="fas fa-sync-alt mr-2"></i>${timeString}
    `;
    document.getElementById('lastUpdated').classList.remove('blink');

    document.getElementById('dataFreshness').textContent = 'Just now';
}

function initializeFilters() {
    setupEventListeners();
    applyFiltersAndRender();
}

console.log('🚀 Indian Stocks Dashboard with AI Predictions initialized');


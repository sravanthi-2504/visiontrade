// Navigation function
function goToDashboard() {
    window.location.href = 'simple-dashboard.html';
}

// Show news based on category
function showNews(category) {
    const newsList = document.getElementById('newsList');
    let newsItems = [];

    switch(category) {
        case 'company':
            newsItems = [
                'Reliance announces ₹75,000 crore green energy investment',
                'TCS Q4 results beat estimates, shares rise 3%',
                'Infosys signs $500 million deal with European client'
            ];
            break;
        case 'market':
            newsItems = [
                'Sensex surges 600 points, Nifty above 22,400',
                'Foreign investors pour ₹2,500 crore into Indian equities',
                'Market volatility index drops to 3-month low'
            ];
            break;
        case 'economy':
            newsItems = [
                'RBI keeps repo rate unchanged at 6.5%',
                'GDP growth forecast revised to 7.2% for FY25',
                'Inflation eases to 4.85% in March'
            ];
            break;
        case 'ipo':
            newsItems = [
                'Aadhar Housing Finance IPO opens tomorrow',
                'Awfis Space Solutions IPO subscribed 12 times on Day 1',
                'Bharti Hexacom lists at 15% premium'
            ];
            break;
        default:
            newsItems = [
                'Market opens flat amid global cues',
                'IT stocks gain on weak rupee'
            ];
    }

    newsList.innerHTML = '';
    newsItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        newsList.appendChild(li);
    });
}

// Create charts
document.addEventListener('DOMContentLoaded', function() {
    // Nifty Chart
    new Chart(document.getElementById('niftyChart'), {
        type: 'line',
        data: {
            labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'],
            datasets: [{
                label: 'Nifty 50',
                data: [22100, 22150, 22200, 22250, 22300, 22350, 22400, 22450],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Nifty 50', color: '#cbd5e1' }
            }
        }
    });

    // Sensex Chart
    new Chart(document.getElementById('sensexChart'), {
        type: 'line',
        data: {
            labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'],
            datasets: [{
                label: 'Sensex',
                data: [73000, 73200, 73400, 73600, 73800, 74000, 74200, 74120],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Sensex', color: '#cbd5e1' }
            }
        }
    });

    // Bank Nifty Chart
    new Chart(document.getElementById('bankNiftyChart'), {
        type: 'line',
        data: {
            labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'],
            datasets: [{
                label: 'Bank Nifty',
                data: [48000, 48200, 48400, 48600, 48800, 48900, 48950, 48900],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Bank Nifty', color: '#cbd5e1' }
            }
        }
    });

    // Nifty 50 Chart (different from Nifty 50 above? Maybe you meant Nifty Next 50)
    new Chart(document.getElementById('nifty50Chart'), {
        type: 'line',
        data: {
            labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'],
            datasets: [{
                label: 'Nifty Next 50',
                data: [58000, 58100, 58200, 58300, 58400, 58500, 58600, 58550],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Nifty Next 50', color: '#cbd5e1' }
            }
        }
    });

    // Nifty 500 Chart
    new Chart(document.getElementById('nifty500Chart'), {
        type: 'line',
        data: {
            labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'],
            datasets: [{
                label: 'Nifty 500',
                data: [18000, 18050, 18100, 18150, 18200, 18250, 18300, 18280],
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Nifty 500', color: '#cbd5e1' }
            }
        }
    });
});
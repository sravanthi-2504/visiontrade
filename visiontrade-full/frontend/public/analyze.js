const params = new URLSearchParams(window.location.search);
const symbol = params.get('symbol');

fetch(`http://localhost:3000/api/stock/${symbol}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById('price').innerText = `₹${data.price}`;
        document.getElementById('pe').innerText = data.pe ?? 'N/A';

        const labels = data.history.map(d => d.date);
        const prices = data.history.map(d => d.close);

        new Chart(document.getElementById('priceChart'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: `${symbol} Price`,
                    data: prices,
                    borderColor: '#3b82f6'
                }]
            }
        });
    });

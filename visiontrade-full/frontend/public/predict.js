// Read stock symbol from URL
const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol");

document.getElementById("stockSymbol").innerText = symbol || "N/A";

// Call backend prediction API
fetch("http://localhost:5001/api/predict", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ symbol })
})
    .then(response => response.json())
    .then(data => {
        if (data.status !== "success") {
            throw new Error(data.message || "Prediction failed");
        }

        const p = data.prediction;

        document.getElementById("loading").classList.add("hidden");
        document.getElementById("result").classList.remove("hidden");

        document.getElementById("currentPrice").innerText = p.current_price;
        document.getElementById("predictedPrice").innerText = p.predicted_price;
        document.getElementById("trend").innerText = p.trend;
        document.getElementById("confidence").innerText = p.confidence;
        document.getElementById("model").innerText = p.model;
    })
    .catch(err => {
        document.getElementById("loading").innerText =
            "Prediction service unavailable.";
        console.error(err);
    });

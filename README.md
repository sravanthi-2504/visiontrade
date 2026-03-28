VisionTrade 📈
An AI-based stock market prediction website that uses machine learning to analyse historical stock data, forecast future price movements, and deliver clear Buy / Hold / Sell recommendations — designed for both beginners and experienced investors.

🗂️ Project Structure
visiontrade/
├── backend/                  # Python Flask ML server
│   ├── app.py                # Flask API entry point
│   ├── model.py              # LSTM & Linear Regression models
│   ├── requirements.txt      # Python dependencies
│   └── ...
├── visiontrade-full/         # Frontend (HTML, CSS, JS, Tailwind)
│   ├── index.html
│   ├── dashboard.html
│   ├── stock.html
│   └── ...
├── server.js                 # Node.js backend (bulk fetching, caching)
├── index.js                  # App entry point
├── package.json              # Node.js dependencies & scripts
└── .gitignore

⚙️ Tech Stack
Layer
Technology
Frontend
HTML5, CSS3, Tailwind CSS, JavaScript, Chart.js
Node.js Backend
Node.js, Express.js
ML Backend
Python, Flask
ML Libraries
TensorFlow/Keras, Scikit-learn, NumPy, Pandas
Data Sources
Yahoo Finance API, Finnhub API, NSE/BSE CSV

🔧 Prerequisites
Make sure you have all of these installed before you begin:
	•	Node.js v18 or above → https://nodejs.org
	•	Python 3.9 or above → https://python.org
	•	pip (comes with Python)
	•	Git → https://git-scm.com
Check your versions:
node -v
python --version
pip --version

🚀 Installation & Setup
1. Clone the repository
git clone https://github.com/sravanthi-2504/visiontrade.git
cd visiontrade
2. Install Node.js dependencies
npm install
3. Set up the Python (Flask) backend
cd backend
pip install -r requirements.txt
cd ..
If you don't have a requirements.txt yet, install manually:
pip install flask flask-cors tensorflow keras scikit-learn pandas numpy yfinance finnhub-python

▶️ Running the Project
You need two terminals running at the same time — one for Node.js and one for Flask.
Terminal 1 — Start the Node.js server
# From the root of the project
npm start
Or if you have a dev script with auto-reload:
npm run dev
The Node.js server will start at: http://localhost:3000

Terminal 2 — Start the Flask ML server
cd backend
python app.py
The Flask server will start at: http://localhost:5000

Open the frontend
Open your browser and go to:
http://localhost:3000
Or open visiontrade-full/index.html directly in your browser if the frontend is served as static files.

🖥️ Opening in WebStorm IDE
Step 1 — Open the project
	1	Launch WebStorm
	2	Click File → Open
	3	Navigate to the cloned visiontrade/ folder and click Open
Step 2 — Set up Node.js in WebStorm
	1	Go to File → Settings (Windows/Linux) or WebStorm → Preferences (Mac)
	2	Navigate to Languages & Frameworks → Node.js
	3	Set the Node interpreter path (WebStorm usually auto-detects it)
	4	Click Apply → OK
Step 3 — Open the built-in Terminal
In WebStorm, use the built-in terminal instead of an external one:
View → Tool Windows → Terminal
Or press: Alt + F12 (Windows/Linux) / Option + F12 (Mac)
Step 4 — Run the servers from WebStorm terminal
Terminal 1 (Node.js):
npm install
npm start
Terminal 2 (Flask) — click the + icon to open a second terminal tab:
cd backend
pip install -r requirements.txt
python app.py
Step 5 — Create Run Configurations (optional but recommended)
WebStorm lets you run both servers with one click:
	1	Go to Run → Edit Configurations
	2	Click the + button → choose Node.js
	◦	Name: Node Server
	◦	JavaScript file: index.js or server.js
	3	Click + again → choose Python
	◦	Name: Flask Server
	◦	Script path: backend/app.py
	4	Save both, then run them from the Run toolbar

📦 Available Scripts
Command
Description
npm install
Install all Node.js dependencies
npm start
Start the Node.js server
npm run dev
Start with nodemon (auto-restarts on file changes)
python app.py
Start the Flask ML server (run from backend/)

🌐 API Endpoints (Flask)
Method
Endpoint
Description
GET
/predict?symbol=TCS
Get LSTM price prediction for a stock
GET
/recommendation?symbol=TCS
Get Buy / Hold / Sell advice
GET
/history?symbol=TCS
Get historical price data

🔑 Environment Variables (if applicable)
Create a .env file in the root directory:
PORT=3000
FLASK_URL=http://localhost:5000
FINNHUB_API_KEY=your_finnhub_api_key_here
Get a free Finnhub API key at: https://finnhub.io

🐛 Common Issues
Port already in use:
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
Python module not found:
pip install -r backend/requirements.txt
Node modules missing:
rm -rf node_modules
npm install
CORS error in browser: Make sure Flask has flask-cors installed and CORS(app) is called in app.py.


from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "app": "VisionTrade API",
        "status": "running",
        "port": 5001,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "port": 5001})

if __name__ == '__main__':
    print("🚀 Starting on PORT 5001")
    print("📡 http://localhost:5001")
    print("🔗 http://localhost:5001/api/health")
    app.run(host='0.0.0.0', port=5001, debug=True)

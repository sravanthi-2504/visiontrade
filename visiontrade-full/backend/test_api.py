from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "VisionTrade API is running!"

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "message": "API is working"})

@app.route('/api/test')
def test():
    return jsonify({"data": "Test successful"})

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 STARTING VISIONTRADE API")
    print("=" * 50)
    print("📡 Running on: http://localhost:5000")
    print("🔗 Test URL:   http://localhost:5000/api/health")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)

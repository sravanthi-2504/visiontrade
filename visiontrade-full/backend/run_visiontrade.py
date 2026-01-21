import socket
import sys
import os
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

def find_free_port(start_port=5000, end_port=5100):
    """Find a free port in the given range"""
    for port in range(start_port, end_port + 1):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    raise Exception(f"No free ports found between {start_port}-{end_port}")

# Create app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "app": "VisionTrade API",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "service": "stock-api"})

@app.route('/api/test')
def test():
    return jsonify({"message": "API is working!"})

if __name__ == '__main__':
    # Find free port
    port = find_free_port(5000, 5100)
    
    print("\n" + "="*50)
    print("🚀 VISIONTRADE STOCK MARKET API")
    print("="*50)
    print(f"📡 Running on: http://localhost:{port}")
    print(f"🔗 Health:     http://localhost:{port}/api/health")
    print(f"📊 Test:       http://localhost:{port}/api/test")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=port, debug=True)

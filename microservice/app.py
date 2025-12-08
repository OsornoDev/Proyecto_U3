from flask import Flask, jsonify, request
import time
import random
import logging
import os

app = Flask(__name__)

# logger JSON simple
handler = logging.StreamHandler()
formatter = logging.Formatter('{"timestamp":"%(asctime)s","service":"transaction-validator","level":"%(levelname)s","message":"%(message)s"}')
handler.setFormatter(formatter)
app.logger.setLevel(logging.INFO)
app.logger.addHandler(handler)

@app.route("/health")
def health():
    return jsonify({"status":"ok"}), 200

@app.route("/validate", methods=["POST"])
def validate():
    start = time.time()
    payload = request.get_json() or {}
    # Simular latencia variable
    simulated = random.choice([10, 20, 30, 120, 200]) / 1000.0
    time.sleep(simulated)
    # Simular error 1% de las solicitudes
    if random.random() < 0.01:
        app.logger.error(f"validation_failed transaction={payload.get('id','-')}")
        return jsonify({"status":"error"}), 500
    latency_ms = int((time.time() - start) * 1000)
    app.logger.info(f"validated transaction={payload.get('id','-')} latency_ms={latency_ms}")
    return jsonify({"status":"ok","latency_ms":latency_ms}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

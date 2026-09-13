import serial
import torch
from datetime import datetime, timezone

from ..data_source import set_source
from ..routes import LABELS, TABLE
from ...db.client import get_client
from ...models.model import load_model

esp32 = serial.Serial("COM7", 115200)
model = load_model()

# The ESP32 has no distance sensor yet — this stands in for that missing
# reading (both as model input and as the DB value) until real hardware exists.
PLACEHOLDER_DISTANCE_MM = 0.0


def predict_risk(temperature, humidity, tilt, distance=PLACEHOLDER_DISTANCE_MM):
    inputs = torch.tensor(
        [[temperature, humidity, distance, tilt]], dtype=torch.float32
    )
    with torch.no_grad():
        output = model(inputs)
    predicted_class = torch.argmax(output, dim=1).item()
    return LABELS[predicted_class]


def read_serial(socketio):
    set_source("esp32")
    client = get_client()
    while True:
        data = esp32.readline().decode().strip()

        temperature, humidity, tilt = map(float, data.split(","))

        sensor_data = {
            "temperature": temperature,
            "humidity": humidity,
            "tilt": tilt
        }

        socketio.emit("sensor_data", sensor_data)

        risk_level = None
        try:
            risk_level = predict_risk(temperature, humidity, tilt)
        except Exception as err:
            print(f"Prediction failed: {err}")

        try:
            row = {
                "time": datetime.now(timezone.utc).isoformat(),
                "temperature_c": temperature,
                "humidity_pct": humidity,
                "distance_mm": PLACEHOLDER_DISTANCE_MM,
                "tilt_deg": tilt,
            }
            if risk_level is not None:
                row["risk_level"] = risk_level
            client.table(TABLE).insert(row).execute()
        except Exception as err:
            print(f"Failed to log sensor reading to Supabase: {err}")

# import serial
# from flask import Flask
# from flask_socketio import SocketIO

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# esp32 = serial.Serial("COM7", 115200)

# def read_serial():
#     while True:
#         data = esp32.readline().decode().strip()

#         temperature, humidity, tilt = map(float, data.split(","))

#         sensor_data = {
#             "temperature": temperature,
#             "humidity": humidity,
#             "tilt": tilt
#         }

#         socketio.emit("sensor_data", sensor_data)

# @socketio.on("connect")
# def connected():
#     print("Client connected")

# if __name__ == "__main__":
#     socketio.start_background_task(read_serial)
#     socketio.run(app, debug=True)

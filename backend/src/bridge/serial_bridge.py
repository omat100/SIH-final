import serial
from datetime import datetime, timezone

from ..data_source import set_source
from ..routes import TABLE
from ...db.client import get_client

esp32 = serial.Serial("COM7", 115200)

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

        try:
            client.table(TABLE).insert({
                "time": datetime.now(timezone.utc).isoformat(),
                "temperature_c": temperature,
                "humidity_pct": humidity,
                "tilt_deg": tilt,
            }).execute()
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
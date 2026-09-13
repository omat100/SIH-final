import random
import time

from ..src.data_source import set_source

def generate_sensor_data(socketio):
    set_source("generator")
    while True:
        data = {
            "temperature": round(random.uniform(25, 35), 2),
            "humidity": round(random.uniform(50, 80), 2),
            "distance": round(random.uniform(1, 8), 2),
            "tilt": round(random.uniform(0, 5), 2)
        }
        socketio.emit("sensor_data", data)
        time.sleep(2)
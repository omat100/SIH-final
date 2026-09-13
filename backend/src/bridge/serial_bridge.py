import serial

esp32 = serial.Serial("COM7", 115200)

def read_serial(socketio):
    while True:
        data = esp32.readline().decode().strip()

        temperature, humidity, tilt = map(float, data.split(","))

        sensor_data = {
            "temperature": temperature,
            "humidity": humidity,
            "tilt": tilt
        }

        socketio.emit("sensor_data", sensor_data)

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
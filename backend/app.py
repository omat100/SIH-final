from flask import Flask
from flask_socketio import SocketIO
from .src.routes.test import test_bp
from .src.routes.prediction import prediction_bp
from .src.routes.dashboard import dashboard_bp
from .src.routes.source import source_bp
from backend.generator.generator import generate_sensor_data
### need to add serial bridge connection here
app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")
socketio.start_background_task(generate_sensor_data, socketio)

app.register_blueprint(test_bp)
app.register_blueprint(prediction_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(source_bp)
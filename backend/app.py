from flask import Flask
from .src.routes.test import test_bp
from .src.routes.prediction import prediction_bp

app = Flask(__name__)

app.register_blueprint(test_bp)
app.register_blueprint(prediction_bp)
from flask import Blueprint, request, jsonify
import torch
from ...models.model import load_model
from . import LABELS, VALID_LABELS

prediction_bp = Blueprint("prediction_bp", __name__, url_prefix="/api/predict")

model = load_model()

@prediction_bp.route("/", methods=["GET"])
def check_load():
    return jsonify({"model": "loaded" if model is not None else "not loaded"})



@prediction_bp.route("/v1", methods=["POST"])
def predict():
    data = request.get_json()

    inputs = torch.tensor([
        data["temperature_c"],
        data["humidity_pct"],
        data["distance_mm_day"],
        data["tilt_deg"]
    ], dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        output = model(inputs)

    predicted_class = torch.argmax(output, dim=1).item()
    label = LABELS[predicted_class]

    probabilities = torch.softmax(output, dim=1)
    confidence = probabilities[0][predicted_class].item()

    if label not in VALID_LABELS:
        return jsonify({"error": "Invalid prediction"}), 500

    breakdown = {
        LABELS[i]: round(probabilities[0][i].item() * 100, 2)
        for i in range(len(LABELS))
    }

    return jsonify({
        "class": predicted_class,
        "label": label,
        "confidence": round(confidence*100,2),
        "probabilities": breakdown
    })
from flask import Blueprint, jsonify

from ..data_source import get_source

source_bp = Blueprint("source_bp", __name__, url_prefix="/api/source")


@source_bp.route("/", methods=["GET"])
def get_data_source():
    return jsonify({"source": get_source()})

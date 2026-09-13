from flask import Blueprint, jsonify

from ...db.client import get_client
from . import TABLE
dashboard_bp = Blueprint("dashboard_bp", __name__, url_prefix="/api/dashboard")




@dashboard_bp.route("/records", methods=["GET"])
def get_records():
    client = get_client()
    res = client.table(TABLE).select("*").order("time", desc=True).execute()
    return jsonify(res.data)

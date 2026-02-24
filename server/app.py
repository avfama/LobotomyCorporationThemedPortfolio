import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from datetime import datetime

# Supabase client
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
TEST_MODE = os.getenv("TEST_MODE", "false").lower() in ("1", "true", "yes")

# When running in TEST_MODE we don't require Supabase credentials and use an
# in-memory store. Otherwise initialize the Supabase client.
if TEST_MODE:
    supabase = None
    ALERTS = []
    UNITS = {}
else:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in environment")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/alerts", methods=["POST"])
def create_alert():
    """Insert an alert originating from the frontend Alert Log.

    Expected frontend shape:
    {
      "id": "A-...",
      "type": "info|warning|danger",
      "message": "...",
      "time": "localized time string",
      "read": false (optional),
      ...other fields...
    }
    """
    payload = request.get_json(force=True)
    if not payload or not payload.get("message"):
        return jsonify({"error": "missing message"}), 400

    # Map frontend fields to DB columns
    record = {
        "external_id": payload.get("id"),
        "message": payload.get("message"),
        "severity": payload.get("type"),
        "source": payload.get("source"),
        "read": bool(payload.get("read", False)),
        "metadata": {k: v for k, v in (payload.items() if isinstance(payload, dict) else []) if k not in ("id", "type", "message", "time", "read", "source")}
    }

    if TEST_MODE:
        # add created_at for test store
        record["created_at"] = datetime.utcnow().isoformat() + "Z"
        ALERTS.insert(0, record)
        return jsonify(record), 201

    resp = supabase.table("alerts").insert(record).execute()
    data = getattr(resp, "data", None) or (resp.get("data") if isinstance(resp, dict) else None)
    return jsonify(data or resp), 201

@app.route("/alerts", methods=["GET"])
def list_alerts():
    # Optional query params: limit, since
    limit = int(request.args.get("limit", 100))
    since = request.args.get("since")
    query = supabase.table("alerts").select("*").order("created_at", desc=True).limit(limit)
    if since:
        query = query.gt("created_at", since)
    if TEST_MODE:
        # support 'since' by returning alerts with created_at > since
        if since:
            try:
                from dateutil import parser as dateparser
                since_dt = dateparser.parse(since)
                filtered = [a for a in ALERTS if dateparser.parse(a.get("created_at")) > since_dt]
            except Exception:
                filtered = ALERTS
        else:
            filtered = ALERTS
        return jsonify(filtered[:limit])

    resp = query.execute()
    data = getattr(resp, "data", None) or (resp.get("data") if isinstance(resp, dict) else None)
    return jsonify(data or resp)

@app.route("/units", methods=["POST"])
def upsert_unit():
    """Upsert a containment unit record using the frontend unit shape.

    Expected frontend shape (from `ContainmentUnitType` in the app):
    {
      "id": "O-01-23",
      "name": "One Sin...",
      "riskLevel": "ZAYIN",
      "status": "contained|working|breached",
      "workCount": 12,
      "qliphothCounter": 100,
      "maxQliphoth": 100,
      "lastBreached": "2026-02-24T12:34:56Z" (optional)
    }
    """
    payload = request.get_json(force=True)
    unit_id = None
    if isinstance(payload, dict):
        unit_id = payload.get("id") or payload.get("unit_id")
    if not unit_id:
        return jsonify({"error": "missing unit id (id or unit_id)"}), 400

    breached_flag = False
    status = payload.get("status")
    if status and status.lower() == "breached":
        breached_flag = True
    elif isinstance(payload.get("breached"), bool):
        breached_flag = payload.get("breached")

    last_breached = payload.get("lastBreached") or payload.get("last_breached")
    if breached_flag and not last_breached:
        last_breached = datetime.utcnow().isoformat() + "Z"

    record = {
        "unit_id": unit_id,
        "name": payload.get("name"),
        "risk_level": payload.get("riskLevel") or payload.get("risk_level"),
        "status": status,
        "work_count": payload.get("workCount"),
        "qliphoth_counter": payload.get("qliphothCounter"),
        "max_qliphoth": payload.get("maxQliphoth"),
        "breached": breached_flag,
        "last_breached": last_breached,
        "metadata": {k: v for k, v in (payload.items() if isinstance(payload, dict) else []) if k not in ("id", "unit_id", "name", "riskLevel", "risk_level", "status", "workCount", "qliphothCounter", "maxQliphoth", "breached", "lastBreached", "last_breached")},
        "updated_at": datetime.utcnow().isoformat() + "Z"
    }

    if TEST_MODE:
        UNITS[unit_id] = record
        return jsonify(record), 200

    resp = supabase.table("containment_units").upsert(record, on_conflict="unit_id").execute()
    data = getattr(resp, "data", None) or (resp.get("data") if isinstance(resp, dict) else None)
    return jsonify(data or resp), 200

@app.route("/units", methods=["GET"])
def list_units():
    if TEST_MODE:
        return jsonify(list(UNITS.values()))

    resp = supabase.table("containment_units").select("*").order("unit_id", desc=False).execute()
    data = getattr(resp, "data", None) or (resp.get("data") if isinstance(resp, dict) else None)
    return jsonify(data or resp)

if __name__ == '__main__':
    # Use the PORT variable provided by Render, default to 5000 for local dev
    port = int(os.environ.get("PORT", 5000))
    # Must bind to 0.0.0.0 for Render to detect the port
    app.run(host='0.0.0.0', port=port)

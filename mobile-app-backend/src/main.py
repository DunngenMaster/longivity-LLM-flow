from flask import Flask, request, jsonify
from flask_cors import CORS
import os, base64, datetime, json

app = Flask(__name__)
CORS(app)

# Base upload paths
UPLOAD_BASE = os.path.join(os.path.dirname(__file__), "..", "uploads")
IMAGE_DIR = os.path.join(UPLOAD_BASE, "images")
USER_DIR = os.path.join(UPLOAD_BASE, "users")

# Ensure folders exist
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(USER_DIR, exist_ok=True)

@app.route("/api/onboarding", methods=["POST"])
def receive_data():
    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON"}), 400

    name = data.get("name", "unknown").replace(" ", "_")
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    user_id = f"{timestamp}_{name}"

    # Save images and update their paths in data
    for key in ["faceImage", "headImage"]:
        img_data = data.get(key)
        if img_data:
            base64_str = img_data.split(",")[-1]
            img_path = os.path.join("uploads", "images", f"{user_id}_{key}.jpg")
            full_path = os.path.join(UPLOAD_BASE, "images", f"{user_id}_{key}.jpg")
            with open(full_path, "wb") as f:
                f.write(base64.b64decode(base64_str))
            data[key] = img_path  # store relative path in JSON

    # Save the user profile JSON
    json_filename = f"{user_id}.json"
    with open(os.path.join(USER_DIR, json_filename), "w") as f:
        json.dump(data, f, indent=2)

    return jsonify({
        "message": "User data received and saved.",
        "user_id": user_id,
        "json_file": f"uploads/users/{json_filename}"
    }), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

from flask import Flask, request, jsonify
from flask_cors import CORS
import model.severityPrediction as severityModelPredict

app = Flask(__name__)
CORS(app)


@app.route("/api/predictSeverity", methods=["POST"])
def predictSeverity():
    data = request.get_json()

    # Extract your form data
    magnitude = data.get("magnitude")
    cdi = data.get("cdi")
    mmi = data.get("mmi")
    tsunami = data.get("tsunami")
    net = data.get("net")
    dmin = data.get("dmin")
    gap = data.get("gap")
    depth = data.get("depth")

    alert_level = severityModelPredict.predict(magnitude, cdi, mmi, tsunami, net, dmin, gap, depth);


    return jsonify(
        {"status": 200, "alert_level": alert_level, "message": "Prediction successful"}
    )


if __name__ == "__main__":
    app.run(debug=True)

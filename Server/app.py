from flask import Flask, request, jsonify
from flask_cors import CORS
import model.severityPrediction as severityModelPredict
import model.resourceAllocation as resourceAllocator

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

    alert_level = severityModelPredict.predict(
        magnitude, cdi, mmi, tsunami, net, dmin, gap, depth
    )

    return jsonify(
        {"status": 200, "alert_level": alert_level, "message": "Prediction successful"}
    )


@app.route("/api/resourceDistrubution", methods=["POST"])
def resourceDistrubution():
    reqData = request.get_json()
    foodHave = reqData.get("foodHave")
    foodRequired = reqData.get("foodRequired")
    waterHave = reqData.get("waterHave")
    waterRequired = reqData.get("waterRequired")
    medicalHave = reqData.get("medicalHave")
    medicalRequired = reqData.get("medicalRequired")
    shelterHave = reqData.get("shelterHave")
    shelterRequired = reqData.get("shelterRequired")
    blanketsHave = reqData.get("blanketsHave")
    blanketsRequired = reqData.get("blanketsRequired")
    rescuePersonnelHave = reqData.get("rescuePersonnelHave")
    rescuePersonnelRequired = reqData.get("rescuePersonnelRequired")

    print(f"{reqData}")
    return jsonify({"test": "test"})


if __name__ == "__main__":
    app.run(debug=True)

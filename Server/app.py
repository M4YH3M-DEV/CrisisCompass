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
    
    # Extract resource data
    resource_data = {
        'foodHave': reqData.get("foodHave", 0),
        'foodRequired': reqData.get("foodRequired", 0),
        'waterHave': reqData.get("waterHave", 0),
        'waterRequired': reqData.get("waterRequired", 0),
        'medicalHave': reqData.get("medicalHave", 0),
        'medicalRequired': reqData.get("medicalRequired", 0),
        'shelterHave': reqData.get("shelterHave", 0),
        'shelterRequired': reqData.get("shelterRequired", 0),
        'blanketsHave': reqData.get("blanketsHave", 0),
        'blanketsRequired': reqData.get("blanketsRequired", 0),
        'rescuePersonnelHave': reqData.get("rescuePersonnelHave", 0),
        'rescuePersonnelRequired': reqData.get("rescuePersonnelRequired", 0)
    }
    
    try:
        # Get resource allocation from the model
        allocation_result = resourceAllocator.allocate_resources(resource_data)
        
        return jsonify({
            "status": 200,
            "message": "Resource allocation calculated successfully",
            "data": allocation_result
        })
        
    except Exception as e:
        return jsonify({
            "status": 500,
            "message": f"Error calculating resource allocation: {str(e)}",
            "data": None
        }), 500


if __name__ == "__main__":
    app.run(debug=True)

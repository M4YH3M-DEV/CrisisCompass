"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterDisaster() {
  const [severity, setSeverity] = useState("");
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);

  // Handel submit for register new disaster
  async function handelSubmitForRegisterNewDisaster(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Extract ALL form data immediately, before any async operations
    const formDataForDisaster = {
      name: formData.get("name") as string,
      severity: severity,
      foodHave: parseFloat(formData.get("foodHave") as string),
      foodRequired: parseFloat(formData.get("foodRequired") as string),
      waterHave: parseFloat(formData.get("waterHave") as string),
      waterRequired: parseFloat(formData.get("waterRequired") as string),
      medicalHave: parseInt(formData.get("medicalHave") as string),
      medicalRequired: parseInt(formData.get("medicalRequired") as string),
      shelterHave: parseInt(formData.get("shelterHave") as string),
      shelterRequired: parseInt(formData.get("shelterRequired") as string),
      blanketsHave: parseInt(formData.get("blanketsHave") as string),
      blanketsRequired: parseInt(formData.get("blanketsRequired") as string),
      rescuePersonnelHave: parseInt(
        formData.get("rescuePersonnelHave") as string
      ),
      rescuePersonnelRequired: parseInt(
        formData.get("rescuePersonnelRequired") as string
      ),
    };

    console.log("Disaster data:", formDataForDisaster);

    try {
      const response = await fetch("api/SaveDisaster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataForDisaster),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Disaster registered successfully:", data);

      // Move to next stage after successful registration
      //   setCurrentStage(1);
      router.push("/");
    } catch (error) {
      console.error("Error registering disaster:", error);
    }
  }

  // Handel submit for severity prediction
  async function handelSubmitForSeverityPrediction(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    // Extract ALL form data immediately, before any async operations
    const formDataForSeverity = {
      magnitude: parseFloat(e.currentTarget.magnitude.value),
      cdi: parseFloat(e.currentTarget.cdi.value),
      mmi: parseFloat(e.currentTarget.mmi.value),
      tsunami: e.currentTarget.tsunami.value,
      net: e.currentTarget.net.value,
      dmin: parseFloat(e.currentTarget.dmin.value),
      gap: parseFloat(e.currentTarget.gap.value),
      depth: parseFloat(e.currentTarget.depth.value),
    };

    // Getting severity
    try {
      const response = await fetch(
        "http://localhost:5000/api/predictSeverity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataForSeverity),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const predictedSeverity = data.alert_level;
      setSeverity(predictedSeverity);
      setCurrentStage(1);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Register a new disaster */}
      {currentStage === 1 ? (
        <form
          className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md font-mono text-green-400"
          onSubmit={handelSubmitForRegisterNewDisaster}
        >
          <h1 className="text-2xl mb-4 text-center">Register New Disaster</h1>

          <label className="block mb-2">
            <span className="text-green-300">Disaster Name</span>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Earthquake Mumbai 2025"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Food Available (kg)</span>
            <input
              type="number"
              step="0.1"
              name="foodHave"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 1500"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Food Required (kg)</span>
            <input
              type="number"
              step="0.1"
              name="foodRequired"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 5000"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Water Available (liters)</span>
            <input
              type="number"
              step="0.1"
              name="waterHave"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 2000"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Water Required (liters)</span>
            <input
              type="number"
              step="0.1"
              name="waterRequired"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 8000"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">
              Medical Supplies Available (units)
            </span>
            <input
              type="number"
              name="medicalHave"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 100"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">
              Medical Supplies Required (units)
            </span>
            <input
              type="number"
              name="medicalRequired"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 500"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Shelter Available (units)</span>
            <input
              type="number"
              name="shelterHave"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 50"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Shelter Required (units)</span>
            <input
              type="number"
              name="shelterRequired"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 200"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Blankets Available (units)</span>
            <input
              type="number"
              name="blanketsHave"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 300"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Blankets Required (units)</span>
            <input
              type="number"
              name="blanketsRequired"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 800"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Rescue Personnel Available</span>
            <input
              type="number"
              name="rescuePersonnelHave"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 25"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-green-300">Rescue Personnel Required</span>
            <input
              type="number"
              name="rescuePersonnelRequired"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 100"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2 rounded transition-colors duration-200"
          >
            Register Disaster
          </button>
        </form>
      ) : null}

      {/* Getting Severity data */}
      {currentStage === 0 ? (
        <form
          className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md font-mono text-green-400"
          onSubmit={handelSubmitForSeverityPrediction}
        >
          <h1 className="text-2xl mb-4 text-center">Severity Calculation</h1>

          <label className="block mb-2">
            <span className="text-green-300">
              Magnitude (Earthquake Strength)
            </span>
            <input
              type="number"
              step="0.1"
              name="magnitude"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 5.6"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">
              Maximum Reported Intensity (CDI)
            </span>
            <input
              type="number"
              step="0.1"
              name="cdi"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 4.5"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">
              Maximum Estimated Instrumental Intensity (MMI)
            </span>
            <input
              type="number"
              step="0.1"
              name="mmi"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 5.0"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">
              Tsunami Indicator (Oceanic vs Land)
            </span>
            <select
              name="tsunami"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select...</option>
              <option value="0">Land-based (0)</option>
              <option value="1">Oceanic (1)</option>
            </select>
          </label>

          <label className="block mb-2">
            <span className="text-green-300">
              Data Network ID (Information Source)
            </span>
            <input
              type="text"
              name="net"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. us, ci, nc"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">
              Horizontal Distance to Nearest Station (dmin)
            </span>
            <input
              type="number"
              step="0.001"
              name="dmin"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 0.15"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-green-300">Azimuthal Gap (degrees)</span>
            <input
              type="number"
              step="0.1"
              name="gap"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 45.2"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-green-300">Earthquake Depth (km)</span>
            <input
              type="number"
              step="0.001"
              name="depth"
              className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 10.5"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2 rounded transition-colors duration-200"
          >
            Submit Seismic Data
          </button>
        </form>
      ) : null}
    </div>
  );
}

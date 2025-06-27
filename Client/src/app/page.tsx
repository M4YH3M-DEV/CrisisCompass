"use client";
import React, { useState } from "react";

export default function Home() {
  const [severity, setSeverity] = useState("");

  async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Extract all form data from the form elements
    const formData = {
      magnitude: parseFloat(e.currentTarget.magnitude.value),
      cdi: parseFloat(e.currentTarget.cdi.value),
      mmi: parseFloat(e.currentTarget.mmi.value),
      tsunami: e.currentTarget.tsunami.value,
      net: e.currentTarget.net.value,
      dmin: parseFloat(e.currentTarget.dmin.value),
      gap: parseFloat(e.currentTarget.gap.value),
      depth: parseFloat(e.currentTarget.depth.value),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/predictSeverity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSeverity(data.alert_level);
      console.log(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  // Function to get severity display properties
  const getSeverityDisplay = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "green":
        return {
          color: "text-green-400",
          bgColor: "bg-green-900",
          borderColor: "border-green-500",
          label: "LOW RISK",
          description: "Minimal seismic activity detected"
        };
      case "yellow":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-900",
          borderColor: "border-yellow-500",
          label: "MODERATE RISK",
          description: "Moderate seismic activity detected"
        };
      case "orange":
        return {
          color: "text-orange-400",
          bgColor: "bg-orange-900",
          borderColor: "border-orange-500",
          label: "HIGH RISK",
          description: "Significant seismic activity detected"
        };
      case "red":
        return {
          color: "text-red-400",
          bgColor: "bg-red-900",
          borderColor: "border-red-500",
          label: "CRITICAL RISK",
          description: "Severe seismic activity detected"
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-900",
          borderColor: "border-gray-500",
          label: "UNKNOWN",
          description: "Unable to determine risk level"
        };
    }
  };

  const resetForm = () => {
    setSeverity("");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {!severity ? (
        <form
          className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md font-mono text-green-400"
          onSubmit={handelSubmit}
        >
          <h1 className="text-2xl mb-4 text-center">Seismic Event Data</h1>

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
      ) : (
        <div className="w-full max-w-md font-mono">
          {(() => {
            const display = getSeverityDisplay(severity);
            return (
              <div className={`${display.bgColor} p-8 rounded-lg shadow-lg border-2 ${display.borderColor}`}>
                <div className="text-center">
                  <h1 className="text-2xl mb-4 text-white">Seismic Risk Assessment</h1>
                  
                  {/* Severity Level Display */}
                  <div className={`inline-block px-6 py-3 rounded-full border-2 ${display.borderColor} mb-4`}>
                    <span className={`text-2xl font-bold ${display.color}`}>
                      {severity.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Risk Label */}
                  <div className={`text-xl font-bold mb-2 ${display.color}`}>
                    {display.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-gray-300 mb-6">
                    {display.description}
                  </div>
                  
                  {/* Visual Indicator */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 rounded-full ${display.borderColor.replace('border', 'bg')} flex items-center justify-center`}>
                      <div className={`w-8 h-8 rounded-full ${display.color.replace('text', 'bg')}`}></div>
                    </div>
                  </div>
                  
                  {/* Reset Button */}
                  <button
                    onClick={resetForm}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded transition-colors duration-200"
                  >
                    Analyze Another Event
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

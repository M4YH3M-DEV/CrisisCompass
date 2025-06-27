"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Disaster {
  _id: string;
  name: string;
  activeStatus: string;
  severity: string;
  createdAt: string;
}

export default function Home() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const response = await fetch("/api/getAllDisaster");
      if (!response.ok) {
        throw new Error("Failed to fetch disasters");
      }
      const data = await response.json();
      setDisasters(data.disasters || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "red":
        return "bg-red-900 text-red-300 border-red-600";
      case "orange":
        return "bg-orange-900 text-orange-300 border-orange-600";
      case "yellow":
        return "bg-yellow-900 text-yellow-300 border-yellow-600";
      case "green":
        return "bg-green-900 text-green-300 border-green-600";
      default:
        return "bg-gray-800 text-gray-300 border-gray-600";
    }
  };

  const getDisasterDataFromDB = async ({ id }: { id: string }) => {
    const formData = {
      id: id,
    };

    const resourceDataresponse = await fetch("/api/getResourceData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const resourceDataresponseData = await resourceDataresponse.json();
    console.log(resourceDataresponseData.data);

    const departmentResourceAllocation = await fetch(
      "http://localhost:5000/api/resourceDistrubution",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resourceDataresponseData.data[0]), // Send the first object from the array
      }
    );

    const departmentResourceAllocationResponse = await departmentResourceAllocation.json();
    console.log(departmentResourceAllocationResponse.data.departments_allocation);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "red":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "orange":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "yellow":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "green":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleRegisterDisaster = () => {
    router.push("/registerDisaster");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-lg">
          <div className="animate-pulse">Loading disaster data...</div>
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-600 text-red-400 px-6 py-4 rounded font-mono max-w-md">
          <div className="text-red-300 font-bold mb-2">ERROR:</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-green-400 mb-2">
              {">"} DISASTER MANAGEMENT SYSTEM
            </h1>
            <p className="text-green-300">
              // Monitor and manage ongoing disaster situations
            </p>
          </div>

          <button
            onClick={handleRegisterDisaster}
            className="inline-flex items-center px-6 py-3 border border-green-600 text-base font-bold rounded bg-green-600 text-black hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            REGISTER DISASTER
          </button>
        </div>

        {disasters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-green-400 text-lg mb-4 font-mono">
              {">"} No disasters in database
            </div>
            <div className="text-green-300 mb-6">
              // Initialize first disaster entry
            </div>
            <button
              onClick={handleRegisterDisaster}
              className="inline-flex items-center px-6 py-3 border border-green-600 text-sm font-bold rounded bg-gray-900 text-green-400 hover:bg-green-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            >
              + REGISTER FIRST DISASTER
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasters.map((disaster, index) => (
              <div
                key={disaster._id}
                className="bg-gray-900 rounded-lg border border-green-600 hover:border-green-400 transition-colors duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-2">
                      <div className="text-green-300 text-sm mb-1">
                        // DISASTER_{String(index + 1).padStart(3, "0")}
                      </div>
                      <h3 className="text-xl font-bold text-green-400 truncate">
                        {disaster.name}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded border text-sm font-bold whitespace-nowrap ${getSeverityColor(
                        disaster.severity
                      )}`}
                    >
                      {getSeverityIcon(disaster.severity)}
                      {disaster.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-green-300">
                      <span className="text-green-600 mr-2">{">"}</span>
                      TIMESTAMP:{" "}
                      {new Date(disaster.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-green-300">
                      <span className="text-green-600 mr-2">{">"}</span>
                      STATUS:{" "}
                      {disaster.activeStatus?.charAt(0).toUpperCase() +
                        disaster.activeStatus?.slice(1)}
                    </div>
                    <div className="flex items-center text-sm text-green-300">
                      <span className="text-green-600 mr-2">{">"}</span>
                      ID: {disaster._id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      className="flex-1 bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 text-sm font-bold"
                      onClick={() =>
                        getDisasterDataFromDB({ id: disaster._id })
                      }
                    >
                      Allocate Resources
                    </button>
                    <button className="flex-1 bg-gray-800 text-green-400 px-4 py-2 rounded border border-green-600 hover:bg-green-600 hover:text-black transition-colors duration-200 text-sm font-bold">
                      MANAGE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="text-green-600 text-sm">
            // SYSTEM STATUS: ONLINE | DISASTERS_TRACKED: {disasters.length} |
            LAST_UPDATE: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

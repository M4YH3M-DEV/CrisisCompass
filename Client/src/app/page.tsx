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

interface ResourceAllocation {
  blankets: number;
  food: number;
  medical: number;
  rescuePersonnel: number;
  shelter: number;
  water: number;
}

interface DepartmentAllocation {
  [departmentName: string]: ResourceAllocation;
}

export default function Home() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocationData, setAllocationData] =
    useState<DepartmentAllocation | null>(null);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(
    null
  );
  const [allocationLoading, setAllocationLoading] = useState(false);

  // Login state management
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);

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

  // Get disaster data from db
  const getDisasterDataFromDB = async ({ id }: { id: string }) => {
    setAllocationLoading(true);
    setSelectedDisasterId(id);

    try {
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
          body: JSON.stringify(resourceDataresponseData.data[0]),
        }
      );

      const departmentResourceAllocationResponse =
        await departmentResourceAllocation.json();
      console.log(departmentResourceAllocationResponse);

      // Store the allocation data in state
      setAllocationData(
        departmentResourceAllocationResponse.data.departments_allocation
      );
    } catch (error) {
      console.error("Error allocating resources:", error);
      setError("Failed to allocate resources");
    } finally {
      setAllocationLoading(false);
    }
  };

  // Start chatting - now opens login popup
  const startChatUsingDisasterId = async ({ id }: { id: string }) => {
    setSelectedDisasterId(id);
    setShowLoginModal(true);
  };

  // Handle login form submission
  const handleDepartmentChatLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/getDepId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginCredentials),
      });

      if (response.ok) {
        const data = await response.json();
        const departmentUserId = data.depId[0].depId;

        // Store both userId and departmentId
        localStorage.setItem("departmentUserId", loginCredentials.username);
        localStorage.setItem("departmentId", departmentUserId.toString());

        setLoginCredentials({ username: "", password: "" });
        router.push(`/chat/${selectedDisasterId}`);
      } else {
        setError("Invalid credentials");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setError(null);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setSelectedDisasterId(null);
    setLoginCredentials({ username: "", password: "" });
    setError(null);
  };

  const closeAllocationModal = () => {
    setAllocationData(null);
    setSelectedDisasterId(null);
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case "medical":
        return "🏥";
      case "rescuePersonnel":
        return "👨‍🚒";
      case "water":
        return "💧";
      case "food":
        return "🍞";
      case "blankets":
        return "🛏️";
      case "shelter":
        return "🏠";
      default:
        return "📦";
    }
  };

  const formatResourceName = (resourceType: string) => {
    switch (resourceType) {
      case "rescuePersonnel":
        return "Rescue Personnel";
      default:
        return resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
    }
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
                      className="flex-1 bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 text-sm font-bold disabled:opacity-50"
                      onClick={() =>
                        getDisasterDataFromDB({ id: disaster._id })
                      }
                      disabled={
                        allocationLoading && selectedDisasterId === disaster._id
                      }
                    >
                      {allocationLoading &&
                      selectedDisasterId === disaster._id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Allocating...
                        </div>
                      ) : (
                        "Allocate Resources"
                      )}
                    </button>
                    <button
                      className="flex-1 bg-gray-800 text-green-400 px-4 py-2 rounded border border-green-600 hover:bg-green-600 hover:text-black transition-colors duration-200 text-sm font-bold"
                      onClick={() =>
                        startChatUsingDisasterId({ id: disaster._id })
                      }
                    >
                      Open Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-green-600 rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-green-400">
                    {">"} LOGIN REQUIRED
                  </h2>
                  <button
                    onClick={closeLoginModal}
                    className="text-green-400 hover:text-green-300 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="text-green-300 text-sm mb-6">
                  // Authentication required to access chat system
                </div>

                <form
                  onSubmit={handleDepartmentChatLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      USERNAME:
                    </label>
                    <input
                      type="text"
                      value={loginCredentials.username}
                      onChange={(e) =>
                        setLoginCredentials({
                          ...loginCredentials,
                          username: e.target.value,
                        })
                      }
                      className="w-full bg-gray-800 border border-green-600 text-green-400 px-3 py-2 rounded focus:outline-none focus:border-green-400 font-mono"
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      PASSWORD:
                    </label>
                    <input
                      type="password"
                      value={loginCredentials.password}
                      onChange={(e) =>
                        setLoginCredentials({
                          ...loginCredentials,
                          password: e.target.value,
                        })
                      }
                      className="w-full bg-gray-800 border border-green-600 text-green-400 px-3 py-2 rounded focus:outline-none focus:border-green-400 font-mono"
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-900 border border-red-600 text-red-300 px-3 py-2 rounded text-sm">
                      <span className="text-red-400 font-bold">ERROR: </span>
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={closeLoginModal}
                      className="flex-1 bg-gray-800 text-green-400 px-4 py-2 rounded border border-green-600 hover:bg-gray-700 transition-colors duration-200 text-sm font-bold"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="flex-1 bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 text-sm font-bold disabled:opacity-50"
                    >
                      {loginLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          AUTHENTICATING...
                        </div>
                      ) : (
                        "LOGIN"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-4 text-center text-green-600 text-xs">
                  // SECURE CONNECTION ESTABLISHED
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resource Allocation Modal */}
        {allocationData && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-green-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-green-400">
                    {">"} RESOURCE ALLOCATION REPORT
                  </h2>
                  <button
                    onClick={closeAllocationModal}
                    className="text-green-400 hover:text-green-300 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {Object.entries(allocationData).map(
                    ([department, resources]) => (
                      <div
                        key={department}
                        className="bg-gray-800 border border-green-700 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center">
                          <span className="text-green-600 mr-2">{">"}</span>
                          {department.toUpperCase()}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          {Object.entries(resources).map(
                            ([resourceType, quantity]) => (
                              <div
                                key={resourceType}
                                className={`bg-gray-700 border rounded p-3 text-center ${
                                  quantity > 0
                                    ? "border-green-600 bg-green-900 bg-opacity-20"
                                    : "border-gray-600"
                                }`}
                              >
                                <div className="text-2xl mb-1">
                                  {getResourceIcon(resourceType)}
                                </div>
                                <div className="text-sm text-green-300 mb-1">
                                  {formatResourceName(resourceType)}
                                </div>
                                <div
                                  className={`text-lg font-bold ${
                                    quantity > 0
                                      ? "text-green-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {quantity}
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        {/* Summary for each department */}
                        <div className="mt-3 text-sm text-green-300">
                          <span className="text-green-600">// </span>
                          Total Resources:{" "}
                          {Object.values(resources).reduce(
                            (sum, qty) => sum + qty,
                            0
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Overall Summary */}
                <div className="mt-6 bg-gray-800 border border-green-600 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-green-400 mb-3">
                    {">"} ALLOCATION SUMMARY
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-green-300">
                      <span className="text-green-600">Departments: </span>
                      {Object.keys(allocationData).length}
                    </div>
                    <div className="text-green-300">
                      <span className="text-green-600">Total Personnel: </span>
                      {Object.values(allocationData).reduce(
                        (sum, dept) => sum + dept.rescuePersonnel,
                        0
                      )}
                    </div>
                    <div className="text-green-300">
                      <span className="text-green-600">Medical Supplies: </span>
                      {Object.values(allocationData).reduce(
                        (sum, dept) => sum + dept.medical,
                        0
                      )}
                    </div>
                    <div className="text-green-300">
                      <span className="text-green-600">Timestamp: </span>
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeAllocationModal}
                    className="px-6 py-2 bg-green-600 text-black font-bold rounded hover:bg-green-700 transition-colors duration-200"
                  >
                    CLOSE REPORT
                  </button>
                </div>
              </div>
            </div>
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

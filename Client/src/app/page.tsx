import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md font-mono text-green-400">
        <h1 className="text-2xl mb-4 text-center">Seismic Event Data</h1>
        
        <label className="block mb-2">
          <span className="text-green-300">Magnitude (Earthquake Strength)</span>
          <input 
            type="number" 
            step="0.1" 
            name="magnitude" 
            className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="e.g. 5.6" 
          />
        </label>

        <label className="block mb-2">
          <span className="text-green-300">Maximum Reported Intensity (CDI)</span>
          <input 
            type="number" 
            step="0.1" 
            name="cdi" 
            className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="e.g. 4.5" 
          />
        </label>

        <label className="block mb-2">
          <span className="text-green-300">Maximum Estimated Instrumental Intensity (MMI)</span>
          <input 
            type="number" 
            step="0.1" 
            name="mmi" 
            className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="e.g. 5.0" 
          />
        </label>

        <label className="block mb-2">
          <span className="text-green-300">Tsunami Indicator (Oceanic vs Land)</span>
          <select 
            name="tsunami" 
            className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="0">Land-based (0)</option>
            <option value="1">Oceanic (1)</option>
          </select>
        </label>

        <label className="block mb-2">
          <span className="text-green-300">Data Network ID (Information Source)</span>
          <input 
            type="text" 
            name="net" 
            className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="e.g. us, ci, nc" 
          />
        </label>

        <label className="block mb-4">
          <span className="text-green-300">Number of Seismic Stations (Location Data)</span>
          <input 
            type="number" 
            name="nst" 
            className="mt-1 block w-full rounded bg-black border border-green-600 px-3 py-2 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="e.g. 25" 
          />
        </label>

        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2 rounded transition-colors duration-200"
        >
          Submit Seismic Data
        </button>
      </form>
    </div>
  );
}

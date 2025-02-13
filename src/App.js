import React, { useState } from "react";
import axios from "axios";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/search/word/${encodeURIComponent(
          searchTerm
        )}`
      );
      setResults(response.data);
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
      console.error("Error searching:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a word to search..."
            className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md text-lg"
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`absolute right-3 top-3 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </div>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {result.word}
              </h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold text-blue-600">Metadata:</span>{" "}
                {result.metadata}
              </p>
              <div className="mt-3">
                <span className="font-semibold text-purple-600">
                  Related Words:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.relatedWords.map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-200"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && results.length === 0 && searchTerm && !error && (
          <div className="text-center py-8 text-gray-500">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchComponent;

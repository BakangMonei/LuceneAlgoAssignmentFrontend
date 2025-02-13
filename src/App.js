import React, { useState } from "react";
import axios from "axios";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("word"); // Default: Exact Match

  // API Base URL
  const API_BASE = "http://localhost:8080/api/search";

  // Handle Search Request
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE}/${searchType}/${encodeURIComponent(searchTerm)}`
      );
      setResults(response.data);
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
      console.error("Error searching:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Index Rebuilding
  const handleRebuildIndex = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE}/rebuild-index`);
      alert(response.data);
    } catch (err) {
      setError("Error rebuilding index.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Deleting a Word from Index
  const handleDeleteWord = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.delete(
        `${API_BASE}/delete/${encodeURIComponent(searchTerm)}`
      );
      alert(response.data);
    } catch (err) {
      setError("Error deleting word.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Deleting Entire Index
  const handleDeleteIndex = async () => {
    if (!window.confirm("Are you sure you want to delete the entire index?"))
      return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.delete(`${API_BASE}/delete-index`);
      alert(response.data);
    } catch (err) {
      setError("Error deleting index.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter Key Press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Search Input */}
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

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`absolute right-3 top-3 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Search Type Selection */}
        <div className="flex space-x-2">
          <label className="font-semibold">Search Type:</label>
          <select
            className="px-3 py-2 border rounded-lg"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="word">Exact Match</option>
            <option value="fuzzy">Fuzzy Search</option>
            <option value="prefix">Prefix Search</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            {error}
          </div>
        )}

        {/* Search Results */}
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

        {/* No Results */}
        {!isLoading && results.length === 0 && searchTerm && !error && (
          <div className="text-center py-8 text-gray-500">
            No results found for "{searchTerm}"
          </div>
        )}

        {/* Admin Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRebuildIndex}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Rebuild Index
          </button>

          <button
            onClick={handleDeleteWord}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Delete Word from Index
          </button>

          <button
            onClick={handleDeleteIndex}
            className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Delete Entire Index
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;

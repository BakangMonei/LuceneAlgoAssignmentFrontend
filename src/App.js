import React, { useState } from "react";
import axios from "axios";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("word");
  const [showModal, setShowModal] = useState(null);

  const API_BASE = "http://localhost:8080/api/search";

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    setError("");

    try {
      let response;
      switch (action) {
        case "rebuild":
          response = await axios.post(`${API_BASE}/rebuild-index`);
          break;
        case "deleteWord":
          if (!searchTerm.trim()) return;
          response = await axios.delete(
            `${API_BASE}/delete/${encodeURIComponent(searchTerm)}`
          );
          break;
        case "deleteIndex":
          response = await axios.delete(`${API_BASE}/delete-index`);
          break;
      }
      setShowModal({ type: "success", message: response.data });
    } catch (err) {
      setShowModal({
        type: "error",
        message: err.response?.data || "Operation failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Search Header */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search term..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`absolute right-2 top-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "..." : "Search"}
            </button>
          </div>

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm text-gray-600 bg-white"
          >
            <option value="word">Exact</option>
            <option value="fuzzy">Fuzzy</option>
            <option value="prefix">Prefix</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 px-4 py-2 border border-red-100 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {result.word}
                </h3>
                <span className="text-sm text-gray-500">{result.metadata}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.relatedWords.map((word, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 cursor-default transition-colors"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="border-t pt-6 mt-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={() =>
                setShowModal({
                  type: "confirm",
                  action: "rebuild",
                  message: "Rebuild index?",
                })
              }
              className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
            >
              Rebuild
            </button>
            <button
              onClick={() =>
                setShowModal({
                  type: "confirm",
                  action: "deleteWord",
                  message: `Delete "${searchTerm}"?`,
                })
              }
              className="px-4 py-2 text-sm text-red-600 bg-white border rounded-lg hover:bg-red-50"
            >
              Delete Word
            </button>
            <button
              onClick={() =>
                setShowModal({
                  type: "confirm",
                  action: "deleteIndex",
                  message: "Delete entire index?",
                })
              }
              className="px-4 py-2 text-sm text-red-600 bg-white border rounded-lg hover:bg-red-50"
            >
              Delete All
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && results.length === 0 && searchTerm && !error && (
          <div className="text-center py-6 text-gray-400">
            No results for "{searchTerm}"
          </div>
        )}

        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {showModal.type === "confirm"
                  ? "Confirm Action"
                  : showModal.type === "error"
                  ? "Error"
                  : "Success"}
              </h3>

              <p className="text-gray-600">{showModal.message}</p>

              <div className="flex justify-end gap-3">
                {showModal.type === "confirm" && (
                  <button
                    onClick={() => {
                      handleAction(showModal.action);
                      setShowModal(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                )}
                <button
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {showModal.type === "confirm" ? "Cancel" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchComponent;

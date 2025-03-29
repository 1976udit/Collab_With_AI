import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import ReactMarkdown from "react-markdown"

const DesignSuggestor =  () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await axios.post("http://localhost:8080/ai/get-design",
        {
          prompt,
        }
      );
      // console.log("response : " ,response)
      const data = response.data;
      console.log("data : ", typeof(data))
      setResponse(marked.parse(data));

      if (data.status === "error") {
        throw new Error(data.response || "Unknown error from API");
      }

      setResponse(data);
    } catch (err) {
      let errorMessage = "Failed to connect to the API service";

      if (err.response) {
        errorMessage =
          err.response.data?.response ||
          err.response.data?.message ||
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else if (err.message) {
        // Something happened in setting up the request
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-600">
        UI Design Assistant
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your UI design needs..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
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
              Generating...
            </span>
          ) : (
            "Get Design Suggestions"
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="mt-3 bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {response && (
        <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Design Suggestions
            </h2>
            <div className="text-gray-700 max-w-screen">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>

          {response.suggestions && response.suggestions.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Follow-up Suggestions
              </h3>
              <div className="flex flex-wrap gap-2">
                {response.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPrompt(suggestion);
                      setResponse(null);
                    }}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
            <span>
              Status:{" "}
              <span
                className={`font-medium ${
                  response.status === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {response.status}
              </span>
            </span>
            <span>
              Generated at: {new Date(response).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignSuggestor;

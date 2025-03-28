import React, { useState} from "react";
import axios from "axios";
import Markdown from "markdown-to-jsx";
import { CodeiumEditor } from "@codeium/react-code-editor";

// Styles
import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";

const CodeReview = () => {
  const [code, setCode] = useState(`function add(a, b) { return a + b; }`);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   prism.highlightAll();
  // }, []);

  async function reviewCode() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/ai/get-review",
        { code }
      );
      setReview(response.data?.review || response.data);
    } catch (err) {
      setError("Failed to get code review. Please try again.");
      console.error("Review error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="m-0 bg-black h-screen w-full p-6 flex gap-4">
      <div className="left h-full basis-1/2 relative overflow-auto">
        <div className="code h-full">
          <CodeiumEditor
            language="javascript"
            theme="vs-dark"
            className="border overflow-auto resize max-h-[90vh] min-h-[300px] border-gray-500 rounded-lg p-4 bg-black text-white"
            value={code}
            onChange={setCode}
          /> 
        </div>
        <button
          onClick={reviewCode}
          disabled={isLoading}
          className="reviewBtn absolute bottom-4 right-8 bg-blue-500 text-white px-8 py-2 font-medium cursor-pointer select-none rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Reviewing..." : "Review"}
        </button>
      </div>
      <div className="right h-full basis-1/2 rounded-lg text-lg bg-gray-800 text-gray-100 p-4 overflow-auto">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <Markdown>{review}</Markdown>
      </div>
    </main>
  );
};

export default CodeReview;

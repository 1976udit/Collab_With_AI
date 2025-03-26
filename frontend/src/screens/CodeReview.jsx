import React, {useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import "highlight.js/styles/github-dark.css";
import { CodeiumEditor } from "@codeium/react-code-editor";
import axios from "axios";
import Markdown from "markdown-to-jsx";

const CodeReview = () => {
    const [code, setCode] = useState(`function add(a, b) { return a + b; }`);
    const [review, setReview] = useState(``)
  useEffect(() => {
    prism.highlightAll();
  }, []);

    async function reviewCode() {
    const response = await axios.post('http://localhost:8080/ai/get-review', { code })
    setReview(JSON.stringify(response.data))
    // console.log(response.data.review)
  }

  return (
    <main className="m-0 bg-black h-screen w-full p-6 flex gap-4">
      <div className="left h-full basis-1/2 relative overflow-auto">
        <div className="code h-full">
          <CodeiumEditor 
            language="javascript"
            theme="vs-dark"
            className="border overflow-auto resize max-h-[570px]
            min-h-[300px] border-gray-500 rounded-lg p-4 bg-black text-white"
            value={code}
            onChange={setCode}
          />
        </div>
        <div
          onClick={reviewCode}
          className="reviewBtn absolute bottom-4 right-8 bg-gray-500 text-white px-8 py-2 font-medium cursor-pointer select-none rounded-lg hover:bg-blue-600 transition-colors"
        >
          Review
        </div>
      </div>
      <div className="right h-full basis-1/2 rounded-lg text-lg bg-gray-500">
        <Markdown>{review}</Markdown>
      </div>
    </main>
  );
};

export default CodeReview;

import React, {useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css";
import Editor from "react-simple-code-editor"
import axios from "axios";
import Markdown from "react-markdown";

const CodeReview = () => {
    const [code, setCode] = useState(`function add(a, b) { return a + b; }`);
    const [review, setReview] = useState('')
  useEffect(() => {
    prism.highlightAll();
  }, []);

    async function reviewCode() {
    const response = await axios.post('http://localhost:8080/ai/get-review', { code })
    setReview(JSON.stringify(response.data.review))
    console.log(response.data)
  }

  return (
    <main className="m-0 bg-black h-screen w-full p-6 flex gap-4">
      <div className="left h-full basis-1/2 relative">
        <div className="code h-full">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div
          onClick={reviewCode}
          className="reviewBtn absolute bottom-4 right-8 bg-gray-500 text-white px-8 py-2 font-medium cursor-pointer select-none rounded-lg hover:bg-blue-600 transition-colors"
        >
          Review
        </div>
      </div>
      <div className="right h-full basis-1/2 rounded-lg bg-gray-500">
        <Markdown rehypeplugins={[rehypeHighlight]}>{review}</Markdown>
      </div>
    </main>
  );
};

export default CodeReview;

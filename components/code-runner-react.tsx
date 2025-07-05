"use client";

import { useEffect } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

export default function SandpackCodeRunner({ 
  code, 
  template,
  onRequestFix 
}: { 
  code: string; 
  template?: string;
  onRequestFix?: (e: string) => void;
}) {
  const [files, setFiles] = useState({
    "/App.tsx": code,
  });

  useEffect(() => {
    if (code && code !== files["/App.tsx"]) {
      setFiles({ "/App.tsx": code });
    }
  }, [code, files]);

  return (
    <Sandpack
      template={template === "react-ts" ? "react-ts" : "react"}
      theme="light"
      files={files}
      options={{
        showTabs: true,
        showLineNumbers: true,
        showConsole: true,
        editorHeight: "600px",
      }}
    />
  );
}
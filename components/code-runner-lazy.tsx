"use client";

import { Suspense, lazy, useState } from "react";

// Lazy load the heavy Sandpack component
const SandpackCodeRunner = lazy(() => import("./code-runner-react"));

export default function LazyCodeRunner({
  language,
  code,
  template,
  onRequestFix,
  files,
}: {
  language: string;
  code: string;
  template?: string;
  onRequestFix?: (e: string) => void;
  files?: Record<string, string>;
}) {
  const [shouldLoadSandpack, setShouldLoadSandpack] = useState(true);

  if (!shouldLoadSandpack) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-600 mb-4">Click to load the code preview</p>
        <button
          onClick={() => setShouldLoadSandpack(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Load Code Preview
        </button>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading code runner...</span>
        </div>
      }
    >
      <SandpackCodeRunner code={code} template={template} onRequestFix={onRequestFix} files={files} />
    </Suspense>
  );
}

"use client";

import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import LazyCodeRunner from "./code-runner-lazy";

interface CodeRunnerProps {
  language: string;
  code: string;
  template?: string;
  onRequestFix?: (e: string) => void;
  showEditor?: boolean;
}

export default function CodeRunner({
  language,
  code,
  template,
  onRequestFix,
  showEditor = true,
}: CodeRunnerProps) {
  if (!showEditor) {
    return (
      <SandpackProvider
        template={template || "react-ts"}
        files={{
          '/App.tsx': code,
        }}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
        }}
      >
        <SandpackPreview 
          showNavigator={false}
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          showRestartButton={false}
          showOpenNewtab={false}
          className="h-full w-full"
        />
      </SandpackProvider>
    );
  }

  return <LazyCodeRunner language={language} code={code} template={template} onRequestFix={onRequestFix} />;
}
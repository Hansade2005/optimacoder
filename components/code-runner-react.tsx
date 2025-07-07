"use client";

import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import dedent from "dedent";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState, useEffect } from "react";
import TemplateSelector from "./template-selector";

export default function ReactCodeRunner({
  files: initialFiles,
  template: initialTemplate,
  onRequestFix,
}: {
  files: { [key: string]: string };
  template?: string;
  onRequestFix?: (e: string) => void;
}) {
  type SandpackTemplate =
    | "react-ts"
    | "react"
    | "vue"
    | "angular"
    | "svelte"
    | "solid"
    | "vanilla";

  const [template, setTemplate] = useState<SandpackTemplate>(
    (initialTemplate as SandpackTemplate) || "react-ts"
  );

  // Only use files from props, do not generate or load any default files
  const [files, setFiles] = useState<{ [key: string]: any }>(initialFiles);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  // Find entry file from special comment in files
  // The AI should include a comment like: // ENTRY: /main.tsx
  function getEntryFile(files: { [key: string]: string }): string {
    for (const [path, content] of Object.entries(files)) {
      const match = content.match(/^[ \t]*\/\/\s*ENTRY:\s*(\S+)/m);
      if (match) {
        return match[1];
      }
    }
    // Fallback to first file or /App.tsx
    return Object.keys(files)[0] || "/App.tsx";
  }

  const entryFile = getEntryFile(files);
  const hasFiles = Object.keys(files).length > 0;

  return (
    <SandpackProvider
      files={hasFiles ? files : {}} // Only use AI files
      options={{
        visibleFiles: hasFiles ? Object.keys(files) : [],
        activeFile: hasFiles ? Object.keys(files)[0] : undefined,
        externalResources: [
          "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
        ],
      }}
      customSetup={{
        dependencies,
        entry: entryFile,
      }}
    >
      <div className="absolute top-2 right-2 z-10">
        <TemplateSelector
          value={template}
          onChange={(newTemplate: SandpackTemplate) => setTemplate(newTemplate)}
        />
      </div>
      <SandpackPreview
        showNavigator={false}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        showRestartButton={false}
        showOpenNewtab={false}
        className="h-full w-full"
      />
      {onRequestFix && <ErrorMessage onRequestFix={onRequestFix} />}
    </SandpackProvider>
  );
}

function ErrorMessage({ onRequestFix }: { onRequestFix: (e: string) => void }) {
  const { sandpack } = useSandpack();
  const [didCopy, setDidCopy] = useState(false);

  if (!sandpack.error) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/5 text-base backdrop-blur-sm">
      <div className="max-w-[400px] rounded-md bg-red-500 p-4 text-white shadow-xl shadow-black/20">
        <p className="text-lg font-medium">Error</p>

        <p className="mt-4 line-clamp-[10] overflow-x-auto whitespace-pre font-mono text-xs">
          {sandpack.error.message}
        </p>

        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={async () => {
              if (!sandpack.error) return;
              setDidCopy(true);
              await window.navigator.clipboard.writeText(sandpack.error.message);
              await new Promise((resolve) => setTimeout(resolve, 2000));
              setDidCopy(false);
            }}
            className="rounded border-red-300 px-2.5 py-1.5 text-sm font-semibold text-red-50"
          >
            {didCopy ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
          </button>
          <button
            onClick={() => {
              if (!sandpack.error) return;
              onRequestFix(sandpack.error.message);
            }}
            className="rounded bg-white px-2.5 py-1.5 text-sm font-medium text-black"
          >
            Try to fix
          </button>
        </div>
      </div>
    </div>
  );
}

const dependencies = {
  "lucide-react": "latest",
  recharts: "2.9.0",
  "react-router-dom": "latest",
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-alert-dialog": "^1.1.1",
  "@radix-ui/react-aspect-ratio": "^1.1.0",
  "@radix-ui/react-avatar": "^1.1.0",
  "@radix-ui/react-checkbox": "^1.1.1",
  "@radix-ui/react-collapsible": "^1.1.0",
  "@radix-ui/react-dialog": "^1.1.1",
  "@radix-ui/react-dropdown-menu": "^2.1.1",
  "@radix-ui/react-hover-card": "^1.1.1",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-menubar": "^1.1.1",
  "@radix-ui/react-navigation-menu": "^1.2.0",
  "@radix-ui/react-popover": "^1.1.1",
  "@radix-ui/react-progress": "^1.1.0",
  "@radix-ui/react-radio-group": "^1.2.0",
  "@radix-ui/react-select": "^2.1.1",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-slider": "^1.2.0",
  "@radix-ui/react-slot": "^1.1.0",
  "@radix-ui/react-switch": "^1.1.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-toast": "^1.2.1",
  "@radix-ui/react-toggle": "^1.1.0",
  "@radix-ui/react-toggle-group": "^1.1.0",
  "@radix-ui/react-tooltip": "^1.1.2",
  "class-variance-authority": "^0.7.0",
  clsx: "^2.1.1",
  "date-fns": "^3.6.0",
  "embla-carousel-react": "^8.1.8",
  "react-day-picker": "^8.10.1",
  "tailwind-merge": "^2.4.0",
  "tailwindcss-animate": "^1.0.7",
  "framer-motion": "^11.15.0",
  vaul: "^0.9.1",
};

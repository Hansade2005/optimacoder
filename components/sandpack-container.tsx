"use client";

import TemplateSelector from "./template-selector";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import dedent from "dedent";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState, useEffect, ReactNode, createContext, useContext } from "react";

// Dependencies for Sandpack
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

type SandpackTemplate = "react-ts" | "react" | "vue" | "angular" | "svelte" | "solid" | "vanilla";

interface ISandpackContext {
  template: SandpackTemplate;
  setTemplate: (t: SandpackTemplate) => void;
  files: { [key: string]: any };
  setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  visibleFiles: string[];
  setVisibleFiles: React.Dispatch<React.SetStateAction<string[]>>;
  activeFile: string;
  setActiveFile: React.Dispatch<React.SetStateAction<string>>;
  onRequestFix?: (e: string) => void;
}
const SandpackContext = createContext<ISandpackContext | undefined>(undefined);

export function useSandpackContainer() {
  const context = useContext(SandpackContext);
  if (context === undefined) {
    throw new Error('useSandpackContainer must be used within a SandpackContainer');
  }
  return context;
}

interface SandpackContainerProps {
  code: string;
  initialTemplate?: string;
  onRequestFix?: (e: string) => void;
  children: ReactNode;
}

export default function SandpackContainer({
  code,
  initialTemplate,
  onRequestFix,
  children,
}: SandpackContainerProps) {
  const [template, setTemplate] = useState<SandpackTemplate>((initialTemplate as SandpackTemplate) || "react-ts");
  const [files, setFiles] = useState<{ [key: string]: any }>({
    "/App.tsx": code,
  });
  const [visibleFiles, setVisibleFiles] = useState<string[]>(["/App.tsx"]);
  const [activeFile, setActiveFile] = useState<string>("/App.tsx");

  useEffect(() => {
    if (code && code !== files["/App.tsx"]) {
      setFiles((prev) => ({ ...prev, "/App.tsx": code }));
      setVisibleFiles((prev) => {
        if (!prev.includes("/App.tsx")) {
          return [...prev, "/App.tsx"].slice(-3);
        }
        return prev;
      });
      setActiveFile("/App.tsx");
    }
  }, [code, files]);

  const sandpackContextValue: ISandpackContext = {
    template,
    setTemplate,
    files,
    setFiles,
    visibleFiles,
    setVisibleFiles,
    activeFile,
    setActiveFile,
    onRequestFix,
  };

  return (
    <SandpackProvider
      key={template}
      template={template}
      files={files}
      options={{
        visibleFiles,
        activeFile,
        externalResources: [
          "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
        ],
      }}
      customSetup={{
        dependencies,
      }}
    >
      <SandpackContext.Provider value={sandpackContextValue}>
        <div className="absolute top-2 right-2 z-10">
          <TemplateSelector
            value={template}
            onChange={(newTemplate) => setTemplate(newTemplate as SandpackTemplate)}
          />
        </div>
        {children}
        {onRequestFix && <ErrorMessage />}
      </SandpackContext.Provider>
    </SandpackProvider>
  );
}

function ErrorMessage() {
  const { sandpack } = useSandpack();
  const { onRequestFix } = useSandpackContainer();
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
              if (!sandpack.error || !onRequestFix) return;
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
"use client";

import TemplateSelector from "./template-selector";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  SandpackPredefinedTemplate, // Import SandpackPredefinedTemplate
} from "@codesandbox/sandpack-react";
import dedent from "dedent";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ReactCodeRunner({
  code,
  template: initialTemplate,
  onRequestFix,
}: {
  code: string;
  template?: SandpackPredefinedTemplate; // Use SandpackPredefinedTemplate type
  onRequestFix?: (e: string) => void;
}) {
  const [template, setTemplate] = useState<SandpackPredefinedTemplate>(initialTemplate || "react-ts");
  // Track files and tab state
  const [files, setFiles] = useState<{ [key: string]: any }>({
    "/App.tsx": code,
  });
  const [visibleFiles, setVisibleFiles] = useState<string[]>(["/App.tsx"]);
  const [activeFile, setActiveFile] = useState<string>("/App.tsx");

  // Helper to add/update files and manage tabs (max 3 open)
  const openFile = (filePath: string, fileCode: string) => {
    setFiles((prev) => ({ ...prev, [filePath]: fileCode }));
    setVisibleFiles((prev) => {
      let next = prev.filter((f) => f !== filePath);
      next.push(filePath);
      if (next.length > 3) next = next.slice(next.length - 3);
      return next;
    });
    setActiveFile(filePath);
  };

  // Example: update files when code prop changes (AI streaming)
  useEffect(() => {
    if (code && code !== files["/App.tsx"]) {
      openFile("/App.tsx", code);
    }
  }, [code, files]); // Added 'files' to dependency array as per ESLint warning

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
      <div className="absolute top-2 right-2 z-10">
        <TemplateSelector
          value={template}
          onChange={(newTemplate: SandpackPredefinedTemplate) => setTemplate(newTemplate)}
        />
      </div>
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor
          showTabs
          showLineNumbers={false}
          showInlineErrors
          wrapContent
          closableTabs
        />
        <SandpackPreview
          showNavigator={false}
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          showRestartButton={false}
          showOpenNewtab={false}
          className="h-full w-full"
        />
      </SandpackLayout>
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
              await window.navigator.clipboard.writeText(
                sandpack.error.message,
              );
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

function getShadcnFiles(shadcnComponents: any) {
  return {
    "/lib/utils.ts": shadcnComponents.utils,
    "/components/ui/avatar.tsx": shadcnComponents.avatar,
    "/components/ui/button.tsx": shadcnComponents.button,
    "/components/ui/card.tsx": shadcnComponents.card,
    "/components/ui/checkbox.tsx": shadcnComponents.checkbox,
    "/components/ui/input.tsx": shadcnComponents.input,
    "/components/ui/label.tsx": shadcnComponents.label,
    "/components/ui/radio-group.tsx": shadcnComponents.radioGroup,
    "/components/ui/select.tsx": shadcnComponents.select,
    "/components/ui/textarea.tsx": shadcnComponents.textarea,
    "/components/ui/index.tsx": `
    export * from "./button"
    export * from "./card"
    export * from "./input"
    export * from "./label"
    export * from "./select"
    export * from "./textarea"
    export * from "./avatar"
    export * from "./radio-group"
    export * from "./checkbox"
    `,
    "/public/index.html": dedent`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `,
  };
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
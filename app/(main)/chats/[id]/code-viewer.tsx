"use client";

import ChevronLeftIcon from "@/components/icons/chevron-left";
import ChevronRightIcon from "@/components/icons/chevron-right";
import CloseIcon from "@/components/icons/close-icon";
import RefreshIcon from "@/components/icons/refresh";
import { extractFirstCodeBlock, splitByFirstCodeFence } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import type { Chat, Message } from "./page";
import { Share } from "./share";
import { StickToBottom } from "use-stick-to-bottom";
import dynamic from "next/dynamic";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";

import { SandpackFileExplorer } from "sandpack-file-explorer"; 

const ExportToGitHub = dynamic(() => import("@/components/export-to-github"), {
  ssr: false,
});

const CodeRunner = dynamic(() => import("@/components/code-runner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-4">
      Loading code runner...
    </div>
  ),
});

const SyntaxHighlighter = dynamic(() => import("@/components/syntax-highlighter"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-4">
      Loading syntax highlighter...
    </div>
  ),
});

type FileChange = {
  type: "create" | "modify" | "delete";
  path: string;
  content?: string;
};

function parseFilesFromContent(content: string) {
  const files: Record<string, string> = {};
  const fileRegex = /```(?:tsx|ts|jsx|js|typescript|javascript|html|css|json|md)\{filename=([^\}]+)\}([\s\S]*?)```/g;

  let match;
  while ((match = fileRegex.exec(content)) !== null) {
    const [, filename, fileContent] = match;
    files[filename] = fileContent.trim();
  }

  if (Object.keys(files).length === 0) {
    const appCode = extractFirstCodeBlock(content);
    if (appCode?.code) {
      files["/App.tsx"] = appCode.code;
    }
  }

  return files;
}

function getProjectContext(files: Record<string, string>) {
  const importsMap: Record<string, string[]> = {};
  const exportsMap: Record<string, string[]> = {};

  Object.entries(files).forEach(([path, content]) => {
    const importMatches = content.matchAll(/import\s.*from\s['"](.*)['"]/g);
    importsMap[path] = [...importMatches].map((m) => m[1]);

    const exportMatches = content.match(/export\s+(const|function|class)\s+(\w+)/g);
    exportsMap[path] = exportMatches
      ? exportMatches.map((m) => m.split(" ")[2])
      : [];
  });

  return {
    filePaths: Object.keys(files),
    imports: importsMap,
    exports: exportsMap,
    components: Object.entries(exportsMap)
      .filter(([_, exports]) => exports.some((e) => /^[A-Z]/.test(e)))
      .map(([path]) => path),
  };
}

function trackFileChanges(
  newFiles: Record<string, string>,
  oldFiles: Record<string, string>,
  setChanges: React.Dispatch<React.SetStateAction<FileChange[]>>
) {
  const newChanges: FileChange[] = [];

  Object.keys(newFiles).forEach((path) => {
    if (!(path in oldFiles)) {
      newChanges.push({ type: "create", path, content: newFiles[path] });
    }
  });

  Object.keys(oldFiles).forEach((path) => {
    if (path in newFiles && oldFiles[path] !== newFiles[path]) {
      newChanges.push({ type: "modify", path, content: newFiles[path] });
    } else if (!(path in newFiles)) {
      newChanges.push({ type: "delete", path });
    }
  });

  setChanges((prev) => [...prev, ...newChanges]);
}

export default function CodeViewer({
  chat,
  streamText,
  message,
  onMessageChange,
  activeTab,
  onTabChange,
  onClose,
  onRequestFix,
}: {
  chat: Chat;
  streamText: string;
  message?: Message;
  onMessageChange: (v: Message) => void;
  activeTab: string;
  onTabChange: (v: "code" | "preview") => void;
  onClose: () => void;
  onRequestFix: (e: string) => void;
}) {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("/App.tsx");
  const [changes, setChanges] = useState<FileChange[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  const updateFiles = useCallback(() => {
    const content = message?.content || streamText;
    if (content) {
      const parsedFiles = parseFilesFromContent(content);
      const projectContext = getProjectContext(parsedFiles);

      trackFileChanges(parsedFiles, files, setChanges);
      setFiles((prev) => ({ ...prev, ...parsedFiles }));

      if (!activeFile || !parsedFiles[activeFile]) {
        const firstFile = Object.keys(parsedFiles)[0] || "/App.tsx";
        setActiveFile(firstFile);
      }
    }
  }, [message?.content, streamText, files, activeFile]);

  useEffect(() => {
    updateFiles();
  }, [updateFiles]);

  const app = message ? extractFirstCodeBlock(message.content) : undefined;
  const streamAppParts = splitByFirstCodeFence(streamText);
  const streamApp = streamAppParts.find(
    (p) =>
      p.type === "first-code-fence-generating" || p.type === "first-code-fence"
  );
  const streamAppIsGenerating = streamAppParts.some(
    (p) => p.type === "first-code-fence-generating"
  );

  const code = streamApp ? streamApp.content : app?.code || "";
  const language = streamApp ? streamApp.language : app?.language || "";
  const title = streamApp ? streamApp.filename.name : app?.filename?.name || "";
  const layout = ["python", "ts", "js", "javascript", "typescript"].includes(
    language
  )
    ? "two-up"
    : "tabbed";

  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");
  const currentVersion = streamApp
    ? assistantMessages.length
    : message
    ? assistantMessages.map((m) => m.id).indexOf(message.id)
    : 1;
  const previousMessage =
    currentVersion !== 0 ? assistantMessages.at(currentVersion - 1) : undefined;
  const nextMessage =
    currentVersion < assistantMessages.length
      ? assistantMessages.at(currentVersion + 1)
      : undefined;

  return (
    <>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-300 px-4">
        <div className="inline-flex items-center gap-4">
          <button
            className="text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close code viewer"
          >
            <CloseIcon className="size-5" />
          </button>
          <span>
            {title} v{currentVersion + 1}
          </span>
        </div>
        {layout === "tabbed" && (
          <div className="rounded-lg border-2 border-gray-300 p-1">
            <button
              onClick={() => onTabChange("code")}
              data-active={activeTab === "code" ? true : undefined}
              className="inline-flex h-7 w-16 items-center justify-center rounded text-xs font-medium data-[active]:bg-blue-500 data-[active]:text-white"
              aria-pressed={activeTab === "code"}
            >
              Code
            </button>
            <button
              onClick={() => onTabChange("preview")}
              data-active={activeTab === "preview" ? true : undefined}
              className="inline-flex h-7 w-16 items-center justify-center rounded text-xs font-medium data-[active]:bg-blue-500 data-[active]:text-white"
              aria-pressed={activeTab === "preview"}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {/* Main */}
      {layout === "tabbed" ? (
        <div className="flex grow flex-col overflow-y-auto bg-white">
          {activeTab === "code" ? (
            <SandpackProvider
              template={
                language === "typescript" || language === "ts"
                  ? "react-ts"
                  : "react"
              }
              files={{
                ...files,
                "/App.tsx": files["/App.tsx"] || "// No code available",
              }}
              options={{
                visibleFiles: Object.keys(files),
                activeFile: activeFile,
              }}
            >
              <SandpackLayout className="flex-grow border border-gray-300 rounded-md">
                <SandpackFileExplorer
                  autoHiddenFiles={false}
                  onDoubleClickFile={(file) => setActiveFile(file)}
                />
                <SandpackCodeEditor
                  showTabs
                  showLineNumbers
                  showInlineErrors
                  wrapContent
                  closableTabs
                  style={{ height: 600 }}
                />
              </SandpackLayout>
            </SandpackProvider>
          ) : (
            language && (
              <div className="flex h-full items-center justify-center">
                <CodeRunner
                  onRequestFix={onRequestFix}
                  language={language}
                  code={code}
                  template={chat.template}
                  key={refresh}
                />
              </div>
            )
          )}
        </div>
      ) : (
        <div className="flex grow flex-col bg-white">
          <div className="h-1/2 overflow-y-auto">
            <SyntaxHighlighter code={code} language={language} />
          </div>
          <div className="flex h-1/2 flex-col">
            <div className="border-t border-gray-300 px-4 py-4">Output</div>
            <div className="flex grow items-center justify-center border-t">
              {!streamAppIsGenerating && (
                <CodeRunner
                  onRequestFix={onRequestFix}
                  language={language}
                  code={code}
                  template={chat.template}
                  key={refresh}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-300 px-4 py-4">
        <div className="inline-flex items-center gap-2.5 text-sm">
          <Share message={message && !streamApp ? message : undefined} />
          <button
            className="inline-flex items-center gap-1 rounded border border-gray-300 px-1.5 py-0.5 text-sm text-gray-600 transition enabled:hover:bg-white disabled:opacity-50"
            onClick={() => setRefresh((r) => r + 1)}
            aria-label="Refresh code runner"
          >
            <RefreshIcon className="size-3" />
            Refresh
          </button>
          {!streamAppIsGenerating && code && (
            <button
              className="inline-flex items-center gap-1 rounded border border-blue-300 bg-blue-50 px-1.5 py-0.5 text-sm text-blue-600 transition enabled:hover:bg-blue-100 disabled:opacity-50"
              onClick={() => setShowExportModal(true)}
            >
              <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Export
            </button>
          )}
        </div>
        <div className="flex items-center justify-end gap-3">
          {previousMessage ? (
            <button
              className="text-gray-900"
              onClick={() => onMessageChange(previousMessage)}
              aria-label="Previous version"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
          ) : (
            <button
              className="text-gray-900 opacity-25"
              disabled
              aria-label="Previous version disabled"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
          )}

          <p className="text-sm">
            Version <span className="tabular-nums">{currentVersion + 1}</span>{" "}
            <span className="text-gray-400">of</span>{" "}
            <span className="tabular-nums">
              {Math.max(currentVersion + 1, assistantMessages.length)}
            </span>
          </p>

          {nextMessage ? (
            <button
              className="text-gray-900"
              onClick={() => onMessageChange(nextMessage)}
              aria-label="Next version"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          ) : (
            <button
              className="text-gray-900 opacity-25"
              disabled
              aria-label="Next version disabled"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <ExportToGitHub
        componentCode={code}
        language={language}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  );
}
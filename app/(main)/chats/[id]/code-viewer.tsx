"use client";

import ChevronLeftIcon from "@/components/icons/chevron-left";
import ChevronRightIcon from "@/components/icons/chevron-right";
import CloseIcon from "@/components/icons/close-icon";
import RefreshIcon from "@/components/icons/refresh";
import { extractFirstCodeBlock, splitByFirstCodeFence } from "@/lib/utils";
import { useState } from "react";
import type { Chat, Message } from "./page";
import { Share } from "./share";
import { StickToBottom } from "use-stick-to-bottom";
import dynamic from "next/dynamic";

// Dynamically import components that might not be needed on the server
const ExportToGitHub = dynamic(() => import("@/components/export-to-github"), {
  ssr: false,
});

const CodeRunner = dynamic(() => import("@/components/code-runner"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-4">Loading code runner...</div>
});
const SyntaxHighlighter = dynamic(
  () => import("@/components/syntax-highlighter"),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-4">Loading syntax highlighter...</div>
  },
);

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
  // Extract application code details from the message or stream
  const app = message ? extractFirstCodeBlock(message.content) : undefined;
  const streamAppParts = splitByFirstCodeFence(streamText);
  const streamApp = streamAppParts.find(
    (p) =>
      p.type === "first-code-fence-generating" || p.type === "first-code-fence",
  );
  const streamAppIsGenerating = streamAppParts.some(
    (p) => p.type === "first-code-fence-generating",
  );

  const code = streamApp ? streamApp.content : app?.code || "";
  const language = streamApp ? streamApp.language : app?.language || "";
  const title = streamApp ? streamApp.filename.name : app?.filename?.name || "";
  // Determine layout based on language (two-up for script languages, tabbed for others)
  const layout = ["python", "ts", "js", "javascript", "typescript"].includes(
    language,
  )
    ? "two-up"
    : "tabbed";

  // Filter assistant messages for version history
  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");
  const currentVersion = streamApp
    ? assistantMessages.length
    : message
      ? assistantMessages.map((m) => m.id).indexOf(message.id)
      : 1; // Default to 1 if no message or stream app
  const previousMessage =
    currentVersion !== 0 ? assistantMessages.at(currentVersion - 1) : undefined;
  const nextMessage =
    currentVersion < assistantMessages.length -1 // Corrected logic: check if there's a next message
      ? assistantMessages.at(currentVersion + 1)
      : undefined;

  // State for refreshing the code runner, showing export modal, and showing context panel
  const [refresh, setRefresh] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(false); // Initialize as false to show bubble

  return (
    <div className="relative h-full flex flex-col">
      {/* Header section */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-300 px-4">
        {/* Left side: Close button and title */}
        <div className="flex items-center gap-4">
          <button
            className="text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close Code Viewer"
          >
            <CloseIcon className="size-5" />
          </button>
          <span>
            {title} v{currentVersion + 1}
          </span>
        </div>

        {/* Tabbed navigation for code/preview (if layout is tabbed) */}
        {layout === "tabbed" && (
          <div className="rounded-lg border-2 border-gray-300 p-1">
            <button
              onClick={() => onTabChange("code")}
              data-active={activeTab === "code" ? true : undefined}
              className="inline-flex h-7 w-16 items-center justify-center rounded text-xs font-medium data-[active]:bg-blue-500 data-[active]:text-white transition-colors"
            >
              Code
            </button>
            <button
              onClick={() => onTabChange("preview")}
              data-active={activeTab === "preview" ? true : undefined}
              className="inline-flex h-7 w-16 items-center justify-center rounded text-xs font-medium data-[active]:bg-blue-500 data-[active]:text-white transition-colors"
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {/* Main content area: Code editor or preview */}
      {layout === "tabbed" ? (
        <div className="flex grow flex-col overflow-y-auto bg-white">
          {activeTab === "code" ? (
            <StickToBottom
              className="relative grow overflow-hidden"
              resize="smooth"
              initial={streamAppIsGenerating ? "smooth" : false}
            >
              <StickToBottom.Content>
                <SyntaxHighlighter code={code} language={language} />
              </StickToBottom.Content>
            </StickToBottom>
          ) : (
            <>
              {language && (
                <div className="flex h-full items-center justify-center">
                  <CodeRunner
                    onRequestFix={onRequestFix}
                    language={language}
                    code={code}
                    template={chat.template}
                    key={refresh}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex grow flex-col bg-white">
          <div className="h-1/2 overflow-y-auto">
            <SyntaxHighlighter code={code} language={language} />
          </div>
          <div className="flex h-1/2 flex-col">
            <div className="border-t border-gray-300 px-4 py-4 text-sm font-medium text-gray-700">Output</div>
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

      {/* Floating Project Context Bubble */}
      {!showContextPanel && (
        <button
          className="fixed bottom-4 right-4 z-20 size-12 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
          onClick={() => setShowContextPanel(true)}
          aria-label="Open Project Context"
        >
          {/* Hamburger icon or info icon */}
          <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
          </svg>
        </button>
      )}

      {/* Project Context Panel (Expanded) */}
      <div
        className={`fixed inset-y-0 right-0 z-20 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${showContextPanel ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Project Context</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowContextPanel(false)}
            aria-label="Close Project Context"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">File:</p>
            <p className="text-base text-gray-900 font-medium break-words">{title || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dependencies:</p>
            <p className="text-base text-gray-900 font-medium break-words">{language || "N/A"} • {chat.template || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Version History:</p>
            <p className="text-base text-gray-900 font-medium">
              v{currentVersion + 1} of {assistantMessages.length}
            </p>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="flex items-center justify-between border-t border-gray-300 px-4 py-4 shrink-0">
        {/* Left side: Share, Refresh, Export buttons */}
        <div className="inline-flex items-center gap-2.5 text-sm">
          <Share message={message && !streamApp ? message : undefined} />
          <button
            className="inline-flex items-center gap-1 rounded border border-gray-300 px-1.5 py-0.5 text-sm text-gray-600 transition enabled:hover:bg-white disabled:opacity-50"
            onClick={() => setRefresh((r) => r + 1)}
            aria-label="Refresh Code Runner"
          >
            <RefreshIcon className="size-3" />
            Refresh
          </button>
          {!streamAppIsGenerating && code && (
            <button
              className="inline-flex items-center gap-1 rounded border border-blue-300 bg-blue-50 px-1.5 py-0.5 text-sm text-blue-600 transition enabled:hover:bg-blue-100 disabled:opacity-50"
              onClick={() => setShowExportModal(true)}
              aria-label="Export to GitHub"
            >
              <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Export
            </button>
          )}
        </div>
        {/* Right side: Version navigation */}
        <div className="flex items-center justify-end gap-3">
          {previousMessage ? (
            <button
              className="text-gray-900 hover:text-gray-700 transition-colors"
              onClick={() => onMessageChange(previousMessage)}
              aria-label="Previous Version"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
          ) : (
            <button className="text-gray-900 opacity-25" disabled aria-label="Previous Version (Disabled)">
              <ChevronLeftIcon className="size-4" />
            </button>
          )}

          <p className="text-sm text-gray-700">
            Version <span className="tabular-nums font-semibold text-gray-900">{currentVersion + 1}</span>{" "}
            <span className="text-gray-400">of</span>{" "}
            <span className="tabular-nums font-semibold text-gray-900">
              {assistantMessages.length}
            </span>
          </p>

          {nextMessage ? (
            <button
              className="text-gray-900 hover:text-gray-700 transition-colors"
              onClick={() => onMessageChange(nextMessage)}
              aria-label="Next Version"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          ) : (
            <button className="text-gray-900 opacity-25" disabled aria-label="Next Version (Disabled)">
              <ChevronRightIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Export to GitHub Modal */}
      <ExportToGitHub
        componentCode={code}
        language={language}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}

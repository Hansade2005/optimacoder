"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ReactNode } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import CodeRunner from "@/components/code-runner";
import ExportToGitHub from "@/components/export-to-github";
import { Message, Chat } from "./page";
import { useState } from "react";
import { splitByFirstCodeFence } from "@/lib/utils";
import CloseIcon from "@/components/icons/close-icon";
import RefreshIcon from "@/components/icons/refresh";
import { Share } from "./share";

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
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [layout, setLayout] = useState<"tabbed" | "split">(
    isMobile ? "tabbed" : "split",
  );
  const [refresh, setRefresh] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  const currentMessageContent = streamText || message?.content || "";
  const app = splitByFirstCodeFence(currentMessageContent);

  const code = app.find((part) => part.type === "first-code-fence")?.content || "";
  const language = app.find((part) => part.type === "first-code-fence")?.language || "tsx";

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-300 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-200 lg:hidden"
            title="Close code viewer"
          >
            <CloseIcon className="size-5" />
          </button>
          <h2 className="text-lg font-semibold">Code Viewer</h2>
        </div>

        <div className="flex items-center gap-2">
          {isMobile ? (
            <div className="flex gap-2">
              <button
                onClick={() => onTabChange("code")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === "code" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Code
              </button>
              <button
                onClick={() => onTabChange("preview")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === "preview" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Preview
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setLayout("tabbed")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${layout === "tabbed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Tabbed
              </button>
              <button
                onClick={() => setLayout("split")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${layout === "split" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Split
              </button>
            </div>
          )}
          <button
            onClick={() => setRefresh((prev) => prev + 1)}
            className="p-2 rounded-md hover:bg-gray-200"
            title="Refresh preview"
          >
            <RefreshIcon className="size-5" />
          </button>
        </div>
      </div>

      {layout === "tabbed" ? (
        <div className="flex grow flex-col overflow-y-auto bg-white">
          {activeTab === "code" ? (
            <div className="h-full">
              <SandpackProvider
                key={refresh}
                template={chat.template}
                files={{
                  '/App.tsx': code,
                }}
                options={{
                  visibleFiles: ['/App.tsx'],
                  activeFile: '/App.tsx',
                  externalResources: [
                    "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
                  ],
                }}
              >
                <SandpackLayout>
                  <SandpackFileExplorer />
                  <SandpackCodeEditor
                    showTabs
                    showLineNumbers={false}
                    showInlineErrors
                    wrapContent
                    closableTabs
                  />
                </SandpackLayout>
              </SandpackProvider>
            </div>
          ) : (
            <div className="h-full">
              <CodeRunner 
                language={language}
                code={code}
                template={chat.template}
                showEditor={false} // Only show preview
                onRequestFix={onRequestFix}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex grow flex-col bg-white">
          {/* Two-up layout for non-tabbed views */}
          <div className="h-1/2 overflow-y-auto">
            <SandpackProvider
              key={refresh}
              template={chat.template}
              files={{
                '/App.tsx': code,
              }}
              options={{
                visibleFiles: ['/App.tsx'],
                activeFile: '/App.tsx',
              }}
            >
              <SandpackLayout>
                <SandpackFileExplorer />
                <SandpackCodeEditor
                  showTabs
                  showLineNumbers={false}
                  showInlineErrors
                  wrapContent
                  closableTabs
                />
              </SandpackLayout>
            </SandpackProvider>
          </div>
          <div className="flex h-1/2 flex-col">
            <div className="border-t border-gray-300 px-4 py-4">Preview</div>
            <div className="flex grow">
              <CodeRunner 
                language={language}
                code={code}
                template={chat.template}
                showEditor={false} // Only show preview
                onRequestFix={onRequestFix}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-300 px-4 py-4">
        <Share message={message} />
        <button
          onClick={() => setShowExportModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Export to GitHub
        </button>
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
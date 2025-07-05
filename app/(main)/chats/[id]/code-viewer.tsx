// ... (previous imports remain the same)

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
  // ... (previous state and variable declarations remain the same)

  return (
    <>
      {/* Header remains the same */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-300 px-4">
        {/* ... existing header code ... */}
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
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer remains the same */}
      <div className="flex items-center justify-between border-t border-gray-300 px-4 py-4">
        {/* ... existing footer code ... */}
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
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
  const layout = ["python", "ts", "js", "javascript", "typescript"].includes(
    language,
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

  const [refresh, setRefresh] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-300 px-4">
        <div className="inline-flex items-center gap-4">
          <button
            className="text-gray-400 hover:text-gray-700"
            onClick={onClose}
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
            >
              Code
            </button>
            <button
              onClick={() => onTabChange("preview")}
              data-active={activeTab === "preview" ? true : undefined}
              className="inline-flex h-7 w-16 items-center justify-center rounded text-xs font-medium data-[active]:bg-blue-500 data-[active]:text-white"
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {layout === "tabbed" ? (
        <div className="flex grow flex-col overflow-y-auto bg-white">
          {activeTab === "code" ? (
            <div className="h-full">
              <CodeRunner
                onRequestFix={onRequestFix}
                language={language}
                code={code}
                template={chat.template}
                key={refresh}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              {language && (
                <div className="h-full w-full">
                  <SyntaxHighlighter code={code} language={language} />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex grow flex-col bg-white">
          <div className="h-1/2 overflow-y-auto">
            <CodeRunner
              onRequestFix={onRequestFix}
              language={language}
              code={code}
              template={chat.template}
              key={refresh}
            />
          </div>
          <div className="flex h-1/2 flex-col">
            <div className="border-t border-gray-300 px-4 py-4">Output</div>
            <div className="flex grow items-center justify-center border-t">
              {!streamAppIsGenerating && (
                <SyntaxHighlighter code={code} language={language} />
              )}
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
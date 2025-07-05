import LazyCodeRunner, { SandpackEditorPane as LazySandpackEditorPane, SandpackPreviewPane as LazySandpackPreviewPane } from "./code-runner-lazy";

export const SandpackEditorPane = LazySandpackEditorPane;
export const SandpackPreviewPane = LazySandpackPreviewPane;

export default function CodeRunner({
  language,
  code,
  template,
  onRequestFix,
  renderMode
}: {
  language: string;
  code: string;
  template?: string;
  onRequestFix?: (e: string) => void;
  renderMode: 'editor' | 'preview';
}) {
  return <LazyCodeRunner language={language} code={code} template={template} onRequestFix={onRequestFix} renderMode={renderMode} />;
}
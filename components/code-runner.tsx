import LazyCodeRunner from "./code-runner-lazy";
import { ReactNode } from "react";

export default function CodeRunner({
  language,
  code,
  template,
  onRequestFix,
  children
}: {
  language: string;
  code: string;
  template?: string;
  onRequestFix?: (e: string) => void;
  children?: ReactNode;
}) {
  return (
    <LazyCodeRunner language={language} code={code} template={template} onRequestFix={onRequestFix}>
      {children}
    </LazyCodeRunner>
  );
}
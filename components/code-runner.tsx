// import {
//   runJavaScriptCode,
//   runPythonCode,
// } from "@/components/code-runner-actions";
// import CodeRunnerServerAction from "@/components/code-runner-server-action";
import LazyCodeRunner from "./code-runner-lazy";

export default function CodeRunner({
  language,
  code,
  template,
  onRequestFix,
  files,
}: {
  language: string;
  code: string;
  template?: string;
  onRequestFix?: (e: string) => void;
  files?: Record<string, string>;
}) {
  return <LazyCodeRunner language={language} code={code} template={template} onRequestFix={onRequestFix} files={files} />;

  // return (
  //   <>
  //     {language === "python" ? (
  //       <CodeRunnerServerAction
  //         code={code}
  //         runCodeAction={runPythonCode}
  //         key={code}
  //       />
  //     ) : ["ts", "js", "javascript", "typescript"].includes(language) ? (
  //       <CodeRunnerServerAction
  //         code={code}
  //         runCodeAction={runJavaScriptCode}
  //         key={code}
  //       />
  //     ) : (
  //       <CodeRunnerReact code={code} />
  //     )}
  //   </>
  // );
}

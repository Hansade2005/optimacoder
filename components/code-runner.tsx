// import {
//   runJavaScriptCode,
//   runPythonCode,
// } from "@/components/code-runner-actions";
// import CodeRunnerServerAction from "@/components/code-runner-server-action";
import LazyCodeRunner from "./code-runner-lazy";

export default function CodeRunner({
  language,
  files,
  template,
  onRequestFix,
}: {
  language: string;
  files: { [key: string]: string };
  template?: string;
  onRequestFix?: (e: string) => void;
}) {
  return <LazyCodeRunner language={language} files={files} template={template} onRequestFix={onRequestFix} />;

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

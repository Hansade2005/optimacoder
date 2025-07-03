// import {
//   runJavaScriptCode,
//   runPythonCode,
// } from "@/components/code-runner-actions";
// import CodeRunnerServerAction from "@/components/code-runner-server-action";
import LazyCodeRunner from "./code-runner-lazy";

export default function CodeRunner({
  language,
  code,
  onRequestFix,
}: {
  language: string;
  code: string;
  onRequestFix?: (e: string) => void;
}) {
  return <LazyCodeRunner language={language} code={code} onRequestFix={onRequestFix} />;

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

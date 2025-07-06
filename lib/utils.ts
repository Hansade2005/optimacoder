import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  utils as shadcnUtils,
  button as shadcnButton,
  card as shadcnCard,
  input as shadcnInput,
  label as shadcnLabel,
  textarea as shadcnTextarea,
  select as shadcnSelect,
} from "./shadcn-essential";

export function extractAllCodeBlocks(input: string) {
  const codeBlocks = [];
  const regex = /```([^\n]*)\n([\s\S]*?)\n```/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const fenceTag = match[1] || "";
    const code = match[2];
    const fullMatch = match[0];

    let language: string | null = null;
    let filename: { name: string; extension: string } | null = null;

    const langMatch = fenceTag.match(/^([A-Za-z0-9]+)/);
    if (langMatch) {
      language = langMatch[1];
    }

    const fileMatch = fenceTag.match(/{\s*filename\s*=\s*([^}]+)\s*}/);
    if (fileMatch) {
      filename = parseFileName(fileMatch[1]);
    } else {
      // If no filename is specified, create a default one
      const extension = language || "txt";
      filename = { name: `file${codeBlocks.length + 1}`, extension };
    }

    codeBlocks.push({ code, language, filename, fullMatch });
  }

  return codeBlocks;
}

function parseFileName(fileName: string): { name: string; extension: string } {
  // Split the string at the last dot
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    // No dot found
    return { name: fileName, extension: "" };
  }
  return {
    name: fileName.slice(0, lastDotIndex),
    extension: fileName.slice(lastDotIndex + 1),
  };
}

export function splitByFirstCodeFence(markdown: string) {
  const result: {
    type: "text" | "first-code-fence" | "first-code-fence-generating";
    content: string;
    filename: { name: string; extension: string };
    language: string;
  }[] = [];

  const lines = markdown.split("\n");

  let inFirstCodeFence = false; // Are we currently inside the first code fence?
  let codeFenceFound = false; // Have we fully closed the first code fence?
  let textBuffer: string[] = [];
  let codeBuffer: string[] = [];

  // We'll store these when we open the code fence
  let fenceTag = ""; // e.g. "tsx{filename=Calculator.tsx}"
  let extractedFilename: string | null = null;

  // Regex to match an entire code fence line, e.g. ```tsx{filename=Calculator.tsx}
  const codeFenceRegex = /^```([^\n]*)$/;

  for (const line of lines) {
    const match = line.match(codeFenceRegex);

    if (!codeFenceFound) {
      if (match && !inFirstCodeFence) {
        // -- OPENING the first code fence --
        inFirstCodeFence = true;
        fenceTag = match[1] || ""; // e.g. tsx{filename=Calculator.tsx}

        // Attempt to extract filename from {filename=...}
        const fileMatch = fenceTag.match(/{\s*filename\s*=\s*([^}]+)\s*}/);
        extractedFilename = fileMatch ? fileMatch[1] : null;

        // Flush any accumulated text into the result
        if (textBuffer.length > 0) {
          result.push({
            type: "text",
            content: textBuffer.join("\n"),
            filename: { name: "", extension: "" },
            language: "",
          });
          textBuffer = [];
        }
        // Don't add the fence line itself to codeBuffer
      } else if (match && inFirstCodeFence) {
        // -- CLOSING the first code fence --
        inFirstCodeFence = false;
        codeFenceFound = true;

        // Parse the extracted filename into { name, extension }
        const parsedFilename = extractedFilename
          ? parseFileName(extractedFilename)
          : { name: "", extension: "" };

        // Extract language from the portion of fenceTag before '{'
        const bracketIndex = fenceTag.indexOf("{");
        const language =
          bracketIndex > -1
            ? fenceTag.substring(0, bracketIndex).trim()
            : fenceTag.trim();

        result.push({
          type: "first-code-fence",
          // content: `\`\`\`${fenceTag}\n${codeBuffer.join("\n")}\n\`\`\``,
          content: codeBuffer.join("\n"),
          filename: parsedFilename,
          language,
        });

        // Reset code buffer
        codeBuffer = [];
      } else if (inFirstCodeFence) {
        // We are inside the first code fence
        codeBuffer.push(line);
      } else {
        // Outside any code fence
        textBuffer.push(line);
      }
    } else {
      // The first code fence has already been processed; treat all remaining lines as text
      textBuffer.push(line);
    }
  }

  // If the first code fence was never closed
  if (inFirstCodeFence) {
    const parsedFilename = extractedFilename
      ? parseFileName(extractedFilename)
      : { name: "", extension: "" };

    // Extract language from the portion of fenceTag before '{'
    const bracketIndex = fenceTag.indexOf("{");
    const language =
      bracketIndex > -1
        ? fenceTag.substring(0, bracketIndex).trim()
        : fenceTag.trim();

    result.push({
      type: "first-code-fence-generating",
      // content: `\`\`\`${fenceTag}\n${codeBuffer.join("\n")}`,
      content: codeBuffer.join("\n"),
      filename: parsedFilename,
      language,
    });
  } else if (textBuffer.length > 0) {
    // Flush any remaining text
    result.push({
      type: "text",
      content: textBuffer.join("\n"),
      filename: { name: "", extension: "" },
      language: "",
    });
  }

  return result;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Framework export utilities
export type FrameworkType = 'nextjs' | 'react-vite' | 'react-cra';

export interface ExportConfig {
  framework: FrameworkType;
  projectName: string;
  files: { [key: string]: string };
  language: string;
  dependencies?: string[];
}

function normalizeImportPaths(code: string, framework: FrameworkType): string {
  // Fix import paths based on framework
  let normalizedCode = code;
  
  switch (framework) {
    case 'nextjs':
      // Replace absolute paths starting with / with @/ for Next.js
      normalizedCode = normalizedCode.replace(/from ['"]\/components\//g, 'from "@/components/');
      normalizedCode = normalizedCode.replace(/from ['"]\/lib\//g, 'from "@/lib/');
      normalizedCode = normalizedCode.replace(/from ['"]\/utils/g, 'from "@/lib/utils');
      break;
      
    case 'react-vite':
    case 'react-cra':
      // Replace absolute paths with relative paths for Vite/CRA
      normalizedCode = normalizedCode.replace(/from ['"]\/components\//g, 'from "./');
      normalizedCode = normalizedCode.replace(/from ['"]\/lib\//g, 'from "../lib/');
      normalizedCode = normalizedCode.replace(/from ['"]\/utils/g, 'from "../lib/utils');
      break;
  }
  
  return normalizedCode;
}

export function generateFrameworkStructure(config: ExportConfig) {
  const { framework, projectName, files, language } = config;

  switch (framework) {
    case 'nextjs':
      return generateNextJsStructure(projectName, files, language);
    case 'react-vite':
      return generateViteStructure(projectName, files, language);
    case 'react-cra':
      return generateCRAStructure(projectName, files, language);
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

function generateNextJsStructure(projectName: string, files: { [key: string]: string }, language: string) {
  const isTypeScript = language === 'tsx' || language === 'typescript';
  const ext = isTypeScript ? 'tsx' : 'jsx';
  
  const structure = {
    'package.json': JSON.stringify({
      name: projectName,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        react: "^18",
        "react-dom": "^18",
        next: "14.0.0",
        ...(isTypeScript && {
          "@types/node": "^20",
          "@types/react": "^18",
          "@types/react-dom": "^18",
          typescript: "^5"
        }),
        "tailwindcss": "^3.3.0",
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.24",
        "lucide-react": "latest",
        "class-variance-authority": "latest",
        "clsx": "latest",
        "tailwind-merge": "latest",
        "@radix-ui/react-slot": "^1.0.2"
      }
    }, null, 2),
    
    'app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Generated with LlamaCoder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,

    'app/globals.css': getTailwindCSS(),
    'tailwind.config.js': getTailwindConfig(),
    'postcss.config.js': getPostCSSConfig(),
    'next.config.js': getNextConfig(),
    'lib/utils.ts': getShadcnEssentialUtils(),
    'components/ui/button.tsx': getShadcnEssentialButton(),
    'components/ui/card.tsx': getShadcnEssentialCard(),
    'components/ui/input.tsx': getShadcnEssentialInput(),
    'components/ui/label.tsx': getShadcnEssentialLabel(),
    'components/ui/textarea.tsx': getShadcnEssentialTextarea(),
    'components/ui/select.tsx': getShadcnEssentialSelect(),
    ...(isTypeScript && { 'tsconfig.json': getTypeScriptConfig() }),
    'README.md': getReadme(projectName, 'Next.js'),
    '.gitignore': getGitIgnore('nextjs')
  };

  for (const [path, code] of Object.entries(files)) {
    const normalizedCode = normalizeImportPaths(code, 'nextjs');
    const finalPath = path.startsWith('/') ? path.substring(1) : path;
    structure[`components/${finalPath}`] = normalizedCode;
  }

  const mainComponent = Object.keys(files)[0];
  const mainComponentPath = mainComponent.startsWith('/') ? mainComponent.substring(1) : mainComponent;

  structure[`app/page.${ext}`] = `import GeneratedApp from '@/components/${mainComponentPath}'

export default function Home() {
  return <GeneratedApp />
}`;
  
  return structure;
}

function generateViteStructure(projectName: string, files: { [key: string]: string }, language: string) {
  const isTypeScript = language === 'tsx' || language === 'typescript';
  const ext = isTypeScript ? 'tsx' : 'jsx';
  
  const structure = {
    'package.json': JSON.stringify({
      name: projectName,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "tailwindcss": "^3.3.0",
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.24",
        "lucide-react": "latest",
        "class-variance-authority": "latest",
        "clsx": "latest",
        "tailwind-merge": "latest",
        "@radix-ui/react-slot": "^1.0.2"
      },
      devDependencies: {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@vitejs/plugin-react": "^4.0.3",
        ...(isTypeScript && { typescript: "^5.0.2" }),
        vite: "^4.4.5"
      }
    }, null, 2),
    
    'src/index.css': getTailwindCSS(),
    'index.html': getViteHTML(projectName),
    'vite.config.ts': getViteConfig(),
    'tailwind.config.js': getTailwindConfig(),
    'postcss.config.js': getPostCSSConfig(),
    ...(isTypeScript && { 'tsconfig.json': getViteTypeScriptConfig() }),
    'README.md': getReadme(projectName, 'Vite'),
    '.gitignore': getGitIgnore('vite')
  };

  for (const [path, code] of Object.entries(files)) {
    const normalizedCode = normalizeImportPaths(code, 'react-vite');
    const finalPath = path.startsWith('/') ? path.substring(1) : path;
    structure[`src/${finalPath}`] = normalizedCode;
  }

  const mainComponent = Object.keys(files)[0];
  const mainComponentPath = mainComponent.startsWith('/') ? mainComponent.substring(1) : mainComponent;
  const mainComponentImportPath = `./${mainComponentPath.replace(/\.tsx?$/, '')}`;

  structure[`src/main.tsx`] = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '${mainComponentImportPath}'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

  return structure;
}

function generateCRAStructure(projectName: string, files: { [key: string]: string }, language: string) {
  const isTypeScript = language === 'tsx' || language === 'typescript';
  const ext = isTypeScript ? 'tsx' : 'jsx';
  
  const structure = {
    'package.json': JSON.stringify({
      name: projectName,
      version: "0.1.0",
      private: true,
      dependencies: {
        "@testing-library/jest-dom": "^5.16.4",
        "@testing-library/react": "^13.3.0",
        "@testing-library/user-event": "^13.5.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "5.0.1",
        "web-vitals": "^2.1.4",
        ...(isTypeScript && {
          "@types/jest": "^27.5.2",
          "@types/node": "^16.11.56",
          "@types/react": "^18.0.17",
          "@types/react-dom": "^18.0.6",
          typescript: "^4.7.4"
        }),
        "tailwindcss": "^3.3.0",
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.24",
        "lucide-react": "latest",
        "class-variance-authority": "latest",
        "clsx": "latest",
        "tailwind-merge": "latest",
        "@radix-ui/react-slot": "^1.0.2"
      },
      scripts: {
        start: "react-scripts start",
        build: "react-scripts build",
        test: "react-scripts test",
        eject: "react-scripts eject"
      },
      eslintConfig: {
        extends: ["react-app", "react-app/jest"]
      },
      browserslist: {
        production: [">0.2%", "not dead", "not op_mini all"],
        development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
      }
    }, null, 2),
    
    'src/index.css': getTailwindCSS(),
    'public/index.html': getCRAHTML(projectName),
    'tailwind.config.js': getTailwindConfig(),
    'postcss.config.js': getPostCSSConfig(),
    ...(isTypeScript && { 'tsconfig.json': getCRATypeScriptConfig() }),
    'README.md': getReadme(projectName, 'Create React App'),
    '.gitignore': getGitIgnore('cra')
  };

  for (const [path, code] of Object.entries(files)) {
    const normalizedCode = normalizeImportPaths(code, 'react-cra');
    const finalPath = path.startsWith('/') ? path.substring(1) : path;
    structure[`src/${finalPath}`] = normalizedCode;
  }

  const mainComponent = Object.keys(files)[0];
  const mainComponentPath = mainComponent.startsWith('/') ? mainComponent.substring(1) : mainComponent;
  const mainComponentImportPath = `./${mainComponentPath.replace(/\.tsx?$/, '')}`;

  structure[`src/index.tsx`] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from '${mainComponentImportPath}';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  return structure;
}

// Helper functions to get shadcn components
function getShadcnEssentialUtils() {
  return shadcnUtils;
}

function getShadcnEssentialButton() {
  return shadcnButton;
}

function getShadcnEssentialCard() {
  return shadcnCard;
}

function getShadcnEssentialInput() {
  return shadcnInput;
}

function getShadcnEssentialLabel() {
  return shadcnLabel;
}

function getShadcnEssentialTextarea() {
  return shadcnTextarea;
}

function getShadcnEssentialSelect() {
  return shadcnSelect;
}

// Helper functions for generating config files
function getTailwindCSS() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;`;
}

function getTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

function getPostCSSConfig() {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
}

function getNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`;
}

function getViteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`;
}

function getViteHTML(projectName: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

function getCRAHTML(projectName: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Generated with LlamaCoder" />
    <title>${projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
}

function getCRAIndex() {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
}

function getTypeScriptConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "es6"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [
        {
          name: "next"
        }
      ],
      paths: {
        "@/*": ["./*"]
      }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  }, null, 2);
}

function getViteTypeScriptConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }]
  }, null, 2);
}

function getCRATypeScriptConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "es6"],
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noFallthroughCasesInSwitch: true,
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx"
    },
    include: ["src"]
  }, null, 2);
}

function getReadme(projectName: string, framework: string) {
  return `# ${projectName}

This project was generated with [LlamaCoder](https://llamacoder.io) and exported as a ${framework} application.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

## Deploy on Vercel

The easiest way to deploy your app is to use the [Vercel Platform](https://vercel.com/new).

Check out the deployment documentation for more details.

## Generated with LlamaCoder

This app was generated using AI with [LlamaCoder](https://llamacoder.io).
`;
}

function getGitIgnore(framework: string) {
  const common = `# Dependencies
node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode
.idea`;

  if (framework === 'nextjs') {
    return `${common}

# Next.js
/.next/
/out/
next-env.d.ts

# Vercel
.vercel`;
  }

  return common;
}

// Utility function to extract <status>...</status> messages
export function extractStatusMessages(input: string): string[] {
  // Extracts all <status>...</status> tags from the input string
  const matches = Array.from(input.matchAll(/<status>([\s\S]*?)<\/status>/g));
  return matches.map((m) => m[1].trim());
}

"use client";

import React from 'react';
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from "sandpack-file-explorer";

// Test multifile project
const testProject = {
  template: 'react-ts',
  files: [
    {
      path: '/App.tsx',
      content: `import React from 'react';
import { Button } from './components/Button';

export default function App() {
  const [count, setCount] = React.useState(0);
  
  const handleClick = () => {
    console.log('Button clicked! Count:', count + 1);
    setCount(count + 1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hello World</h1>
      <p>Count: {count}</p>
      <Button onClick={handleClick}>
        Click me
      </Button>
    </div>
  );
}`
    },
    {
      path: '/components/Button.tsx',
      content: `import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#0056b3';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#007bff';
      }}
    >
      {children}
    </button>
  );
}`
    }
  ]
};

export default function TestPage() {
  const sandpackFiles: Record<string, string> = {};
  
  testProject.files.forEach((file: any) => {
    sandpackFiles[file.path] = file.content;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sandpack Multifile Support Test</h1>
      
      {/* Test 1: Multifile Code Editor */}
      <div style={{ height: '400px', border: '1px solid #ccc', marginBottom: '20px' }}>
        <h2>Multifile Code Editor Test</h2>
        <SandpackProvider
          template={testProject.template as any}
          files={sandpackFiles}
        >
          <div style={{ display: 'flex', height: '350px' }}>
            <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
              <SandpackFileExplorer />
            </div>
            <div style={{ flex: 1 }}>
              <SandpackCodeEditor 
                closableTabs 
                showTabs 
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </SandpackProvider>
      </div>

      {/* Test 2: Preview with Console */}
      <div style={{ height: '500px', border: '1px solid #ccc' }}>
        <h2>Preview with Console Test</h2>
        <SandpackProvider
          template={testProject.template as any}
          files={sandpackFiles}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '450px' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <SandpackPreview
                showNavigator={false}
                showOpenInCodeSandbox={false}
                showRefreshButton={false}
                showRestartButton={false}
                showOpenNewtab={false}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            <div style={{ height: '150px', borderTop: '1px solid #ccc' }}>
              <div style={{ padding: '8px 16px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: '500' }}>
                Console
              </div>
              <div style={{ height: '120px', overflow: 'auto' }}>
                <SandpackConsole style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </SandpackProvider>
      </div>
    </div>
  );
}
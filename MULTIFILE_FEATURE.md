# Multifile Support Feature

## Overview

This feature adds comprehensive multifile project support to LlamaCoder, transforming it from a single-file component generator into a complete multipage template framework project builder that leverages Sandpack's built-in template system.

## Key Features

### 🗂️ Template Selection
- **React + TypeScript**: Modern React with TypeScript support
- **React**: React with JavaScript
- **Next.js**: Full-stack React framework with pages router
- **Vite + React + TS**: Fast build tool with React and TypeScript
- **Vite + React**: Fast build tool with React
- **Astro**: Static site generator
- **Vue + TypeScript**: Vue.js with TypeScript
- **Vue**: Vue.js framework
- **Svelte**: Compile-time framework
- **Vanilla + TypeScript**: Plain TypeScript
- **Vanilla**: Plain JavaScript

### 🔄 Intelligent Mode Detection
- **Single File Mode**: Traditional single-component generation (default)
- **Multifile Mode**: Complete project structure generation with multiple components, utilities, and proper organization

### 🎯 Smart Code Block Parsing
The system can automatically detect and parse multifile projects from AI responses using multiple syntax formats:

```typescript
// Method 1: Filename in braces
```tsx{filename=App.tsx}
export default function App() { return <div>Hello</div>; }
```

// Method 2: Language:filepath syntax  
```tsx:src/components/Button.tsx
export default function Button() { return <button>Click</button>; }
```

// Method 3: Language filepath syntax
```tsx src/utils/helpers.ts
export const formatDate = (date: Date) => date.toISOString();
```
```

### 🏗️ Enhanced AI Prompts
When multifile mode is enabled, the AI receives enhanced prompts that:
- Request complete project structures with multiple files
- Specify template-specific best practices and conventions
- Encourage proper file organization and imports/exports
- Generate template-appropriate configuration files

### 🎨 Seamless Sandpack Integration
- Leverages Sandpack's native template system for authentic framework experiences
- Supports all major frontend frameworks and build tools
- Maintains proper development server functionality
- Preserves hot module replacement and error handling

## User Interface

### Multifile Toggle
A clean toggle switch in the form controls that enables/disables multifile mode:
- **Off**: Traditional single-file component generation
- **On**: Reveals template selector and enables multifile project generation

### Template Selector
When multifile mode is enabled, users can choose from a comprehensive list of modern web development templates, each optimized for specific use cases:
- Static sites (Astro, Vanilla)
- SPAs (React, Vue, Svelte)
- Full-stack frameworks (Next.js)
- Modern build tools (Vite variants)

## Technical Implementation

### Core Types
```typescript
export type SandpackTemplate = 
  | 'react' | 'react-ts' 
  | 'nextjs' 
  | 'vite-react' | 'vite-react-ts'
  | 'astro'
  | 'vue' | 'vue-ts'
  | 'svelte'
  | 'vanilla' | 'vanilla-ts'
  | 'solid';

export interface MultiFileProject {
  template: SandpackTemplate;
  files: ProjectFile[];
  mainFile?: string;
  dependencies?: Record<string, string>;
}

export interface ProjectFile {
  path: string;
  content: string;
}
```

### ReactCodeRunner Enhancement
The enhanced `ReactCodeRunner` component now:
- Accepts both single-file code and multifile projects
- Automatically detects project structure from AI responses
- Applies appropriate Sandpack templates
- Maintains backward compatibility with existing single-file workflows

### AI Prompt Enhancement
The system now generates different prompts based on mode:
- **Single-file**: Optimized for component-focused development
- **Multifile**: Structured for complete application architecture

## Usage Examples

### Single File (Traditional)
User input: "Build a calculator component"
AI generates: Single React component with calculator functionality

### Multifile React Project
User input: "Build a todo app with multiple components" (Multifile enabled, React-TS template)
AI generates: 
- `/App.tsx` - Main application component
- `/components/TodoList.tsx` - Todo list component
- `/components/TodoItem.tsx` - Individual todo item
- `/components/AddTodo.tsx` - Add todo form
- `/context/TodoContext.tsx` - State management
- `/types/todo.ts` - TypeScript interfaces

### Multifile Next.js Project  
User input: "Create a blog application" (Multifile enabled, Next.js template)
AI generates:
- `/pages/_app.js` - Next.js app wrapper
- `/pages/index.js` - Homepage
- `/pages/blog/[slug].js` - Dynamic blog post page
- `/components/BlogPost.tsx` - Blog post component
- `/components/BlogList.tsx` - Blog list component
- `/lib/posts.js` - Post data utilities

### Multifile Astro Project
User input: "Build a portfolio website" (Multifile enabled, Astro template)
AI generates:
- `/src/pages/index.astro` - Homepage
- `/src/pages/about.astro` - About page
- `/src/components/Header.astro` - Site header
- `/src/components/ProjectCard.astro` - Project showcase
- `/src/layouts/Layout.astro` - Base layout

## Benefits

### For Users
- **Complete Project Generation**: Go from idea to full project structure instantly
- **Framework Best Practices**: Generated code follows established conventions
- **Learning Opportunity**: See how professional projects are organized
- **Production Ready**: Generated projects include proper configuration and structure

### For Developers
- **Scalable Architecture**: Built on Sandpack's proven template system
- **Extensible Design**: Easy to add new templates and frameworks
- **Backward Compatible**: Existing single-file workflows continue to work
- **Type Safe**: Full TypeScript support throughout the codebase

## Future Enhancements

- **Custom Templates**: Allow users to define and save their own project templates
- **Project Settings**: Template-specific configuration options (routing, state management, etc.)
- **Component Libraries**: Integration with popular component libraries beyond Shadcn/UI
- **Deployment Integration**: Direct deployment to platforms like Vercel, Netlify, etc.
- **Project Import**: Import existing multifile projects for modification
- **Real-time Collaboration**: Multiple developers working on the same generated project

## Compatibility

- ✅ All existing single-file workflows
- ✅ Current export functionality
- ✅ Shadcn/UI component library
- ✅ Tailwind CSS styling
- ✅ TypeScript and JavaScript
- ✅ All supported AI models
- ✅ Error handling and debugging tools
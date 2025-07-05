# AI Contributor Guidelines

## Tech Stack Overview

- **Frontend Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Components**: Primarily shadcn/ui components (pre-styled, accessible)
- **State Management**: React hooks (useState, useContext) for local state
- **Icons**: Lucide React for all icon needs
- **Forms**: Native HTML forms with server actions
- **Animations**: Framer Motion for complex animations
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: Prisma ORM with Neon serverless Postgres
- **AI Integration**: Together AI API with Llama 3.1 405B model

## Library Usage Rules

### UI Components
1. **Always use shadcn/ui components first** when available:
   - Buttons, inputs, cards, dialogs, etc.
   - Import from `/components/ui/[component]`
2. **Only customize via Tailwind classes** - don't modify component source files
3. **No arbitrary values in Tailwind** (e.g., avoid `h-[500px]`)

### Styling
1. **Tailwind CSS only** - no CSS/Sass/LESS files
2. **Responsive design required** - use Tailwind responsive prefixes
3. **Color system**: Use the predefined color palette from `tailwind.config.ts`

### State Management
1. **Local state**: `useState` and `useReducer` hooks
2. **Global state**: React Context for app-wide state
3. **No Redux/Zustand** - keep it simple with React built-ins

### Data Fetching
1. **Server Components**: Fetch data directly in server components
2. **Client-side**: `fetch` API with caching
3. **No SWR/React Query** - not needed with App Router

### Forms
1. **Server Actions**: Handle form submissions
2. **Native HTML forms** with progressive enhancement
3. **Validation**: Zod for schema validation

### Animations
1. **Simple transitions**: Tailwind transition utilities
2. **Complex animations**: Framer Motion
3. **No GSAP/Anime.js** - keep bundle size small

### Icons
1. **Lucide React only** - consistent icon set
2. Import from `lucide-react`
3. No other icon libraries allowed

### Error Handling
1. **Toast notifications** for user feedback
2. **Error boundaries** for component errors
3. **No custom error solutions** - use built-in patterns

### Performance
1. **Code splitting**: Automatic with Next.js
2. **Lazy loading**: Dynamic imports for heavy components
3. **Image optimization**: Next.js Image component

## Best Practices

1. **TypeScript everywhere** - no `any` types
2. **Small, focused components** - max 100-150 lines
3. **Clear prop interfaces** - document with JSDoc
4. **Accessibility first** - semantic HTML, ARIA when needed
5. **Mobile-first design** - test on small screens
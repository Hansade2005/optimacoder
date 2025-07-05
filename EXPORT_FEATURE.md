# Export to GitHub & Deploy Feature

This feature allows users to export AI-generated components to various framework structures and push them directly to GitHub for easy deployment.

## How It Works

1. **Generate Component**: User creates a component using the AI chat interface
2. **Click Export**: User clicks the "Export" button in the code viewer
3. **Select Framework**: Choose from Next.js, React+Vite, or Create React App
4. **Configure GitHub**: Enter project name and GitHub credentials
5. **Auto-Deploy**: System creates repository with proper structure and provides Vercel deployment link

## Supported Frameworks

### Next.js (Recommended)
- Full App Router structure
- TypeScript support
- Tailwind CSS pre-configured
- shadcn/ui components included
- Ready for Vercel deployment

### React + Vite
- Fast development server
- Modern build tooling
- TypeScript support
- Optimized for SPA deployment

### Create React App
- Traditional React setup
- Wide compatibility
- Easy to understand structure

## Features

### Automatic Project Structure Generation
- Creates proper folder structure for each framework
- Includes all necessary config files (tailwind.config.js, tsconfig.json, etc.)
- Sets up package.json with correct dependencies
- Adds README with deployment instructions

### GitHub Integration
- Creates new repository automatically
- Uploads all project files
- Sets up proper .gitignore
- Provides deployment instructions

### Vercel Deployment Ready
- Direct deployment links
- Optimized configurations
- Environment variables setup
- Zero-config deployment

## Usage Instructions

### For Users

1. **Create GitHub Token**:
   - Go to https://github.com/settings/tokens
   - Create new token with 'repo' permissions
   - Copy the token (starts with `ghp_`)

2. **Export Component**:
   - Generate your component using the AI
   - Click the "Export" button in the code viewer
   - Fill in the export form:
     - Framework: Choose your preferred framework
     - Project Name: Use lowercase with hyphens (e.g., `my-todo-app`)
     - GitHub Username: Your GitHub username
     - GitHub Token: Paste your personal access token

3. **Deploy to Vercel**:
   - Click the "Deploy to Vercel" button in the success message
   - Or manually connect the repository at https://vercel.com/new

### For Developers

The export system uses these key components:

- `generateFrameworkStructure()` - Creates project file structure
- `ExportToGitHub` component - User interface for export
- `/api/export-to-github` - Server-side GitHub API integration

## Security Considerations

- GitHub tokens are never stored or logged
- Tokens are only used for the single repository creation
- All repositories are created as public by default
- Users should use tokens with minimal required permissions

## Framework-Specific Features

### Next.js Export Includes:
- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx` - Main page component
- `components/` - Component directory
- Full TypeScript configuration
- Next.js specific optimizations

### Vite Export Includes:
- `src/` directory structure
- `index.html` template
- Vite configuration
- Fast HMR development server
- Optimized production builds

### CRA Export Includes:
- Traditional `src/` structure
- `public/` directory
- React Scripts configuration
- Testing setup included
- Wide ecosystem compatibility

## Deployment Instructions

After export, users can deploy using:

1. **Vercel (Recommended)**:
   - One-click deployment
   - Automatic CI/CD
   - Custom domains
   - Edge functions support

2. **Netlify**:
   - Connect GitHub repository
   - Automatic deployments
   - Form handling
   - CDN distribution

3. **GitHub Pages**:
   - Enable Pages in repository settings
   - Build and deploy workflow
   - Free hosting for public repos

## Troubleshooting

### Common Issues:

1. **Token Permissions**: Ensure GitHub token has 'repo' scope
2. **Repository Name**: Use valid GitHub repository names (lowercase, hyphens)
3. **Rate Limits**: GitHub API has rate limits for repository creation
4. **Dependencies**: Some dependencies might need manual installation

### Error Messages:

- "Missing required fields" - Fill in all form fields
- "Failed to export to GitHub" - Check token permissions and network
- "Repository already exists" - Choose a different project name

## Future Enhancements

Planned features for the export system:

- Support for more frameworks (Astro, SvelteKit, etc.)
- Private repository option
- Custom domain configuration
- Environment variables setup
- Database integration templates
- Multi-component exports
- Automatic dependency optimization

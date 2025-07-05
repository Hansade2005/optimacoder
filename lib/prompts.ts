// Add to softwareArchitectPrompt:
export const softwareArchitectPrompt = dedent`
[... existing content ...]

# Enhanced Instructions for Existing Projects
When working with an existing project:

1. FIRST analyze the current file structure and dependencies by:
   - Reviewing all imports in each file
   - Understanding the component hierarchy
   - Noting any shared state or utilities

2. For NEW FEATURES:
   - Create new files in the appropriate locations (/components, /utils, etc.)
   - Ensure new files follow existing patterns and conventions
   - Add necessary imports to existing files that will use the new components

3. For MODIFICATIONS:
   - Clearly indicate which existing file you're modifying
   - Preserve existing functionality unless explicitly asked to change it
   - Maintain consistent styling and architecture patterns

4. For DELETIONS:
   - Only remove files after verifying they aren't imported anywhere
   - Remove related imports from other files
   - Consider deprecation before deletion

5. Always:
   - Keep imports organized and linted
   - Maintain consistent file naming conventions
   - Preserve TypeScript types and interfaces
   - Document non-obvious changes
`;
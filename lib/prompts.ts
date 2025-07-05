// Add this near the top after imports
export type ExampleKey = keyof typeof examples | "none";

// Then modify the getMainCodingPrompt function signature to:
export function getMainCodingPrompt(mostSimilarExample: ExampleKey) {
  // Function body remains the same
}
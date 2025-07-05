type FileChange = {
  type: 'create' | 'modify' | 'delete';
  path: string;
  content?: string;
  timestamp?: number;
  dependencies?: string[]; // Files that import this file
};
// Add these types and state:
type FileChange = {
  type: 'create' | 'modify' | 'delete';
  path: string;
  content?: string;
};

const [changes, setChanges] = useState<FileChange[]>([]);

// Add this function to track changes
function trackFileChanges(newFiles: Record<string, string>) {
  const newChanges: FileChange[] = [];
  
  // Detect new files
  Object.keys(newFiles).forEach(path => {
    if (!(path in files)) {
      newChanges.push({
        type: 'create',
        path,
        content: newFiles[path]
      });
    }
  });
  
  // Detect modified files
  Object.keys(files).forEach(path => {
    if (path in newFiles && files[path] !== newFiles[path]) {
      newChanges.push({
        type: 'modify',
        path,
        content: newFiles[path]
      });
    }
  });
  
  // Detect deleted files
  Object.keys(files).forEach(path => {
    if (!(path in newFiles)) {
      newChanges.push({
        type: 'delete',
        path
      });
    }
  });
  
  setChanges(prev => [...prev, ...newChanges]);
}
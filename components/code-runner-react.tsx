useEffect(() => {
  if (code && code !== files["/App.tsx"]) {
    setFiles({ "/App.tsx": code });
  }
}, [code, files]); // Added files to dependency array
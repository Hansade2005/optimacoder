"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 
'@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Github, ExternalLink, Loader2 } from 'lucide-react';
import { FrameworkType } from '@/lib/utils';

interface ExportToGitHubProps {
  componentCode: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportToGitHub({ 
  componentCode, 
  language, 
  isOpen, 
  onClose 
}: ExportToGitHubProps) {
  const [framework, setFramework] = useState<FrameworkType>('nextjs');
  const [projectName, setProjectName] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleExport = async () => {
    if (!projectName || !githubToken || !githubUsername) {
      setError('Please fill in all required fields');
      return;
    }

    setIsExporting(true);
    setError('');

    try {
      const response = await fetch('/api/export-to-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          framework,
          projectName,
          componentCode,
          language,
          githubToken,
          githubUsername
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Export failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Export to GitHub & Deploy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                <Select value={framework} onValueChange={(value: FrameworkType) => setFramework(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nextjs">Next.js (Recommended)</SelectItem>
                    <SelectItem value="react-vite">React + Vite</SelectItem>
                    <SelectItem value="react-cra">Create React App</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-app"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUsername">GitHub Username</Label>
                <Input
                  id="githubUsername"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="your-github-username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubToken">GitHub Personal Access Token</Label>
                <Input
                  id="githubToken"
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <p className="text-xs text-gray-500">
                  Create a token at{' '}
                  <a 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub Settings
                  </a>
                  {' '}with 'repo' permissions
                </p>
              </div>

              <div className="space-y-2">
                <Label>Component Preview</Label>
                <Textarea
                  value={componentCode}
                  readOnly
                  className="h-32 font-mono text-xs"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={onClose} className="flex-1 border border-gray-300 bg-white text-gray-800 hover:bg-gray-100">
                  Cancel
                </Button>
                <Button 
                  onClick={handleExport} 
                  disabled={isExporting}
                  className="flex-1"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4 mr-2" />
                      Export to GitHub
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                ✅ {result.message}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Repository Created:</h3>
                <a 
                  href={result.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  {result.repoUrl}
                </a>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Deploy to Vercel:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {result.deploymentInstructions.vercelDeploy.steps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                <a 
                  href={result.deploymentInstructions.vercelDeploy.directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Deploy to Vercel
                </a>
              </div>

              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

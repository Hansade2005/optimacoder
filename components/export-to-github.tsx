"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 
'@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Github, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { FrameworkType } from '@/lib/utils';

interface ExportToGitHubProps {
  componentCode: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

interface GitHubAuthStatus {
  authenticated: boolean;
  username?: string;
  token?: string;
}

export default function ExportToGitHub({ 
  componentCode, 
  language, 
  isOpen, 
  onClose 
}: ExportToGitHubProps) {
  const [framework, setFramework] = useState<FrameworkType>('nextjs');
  const [projectName, setProjectName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState<GitHubAuthStatus>({ authenticated: false });
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check GitHub authentication status
  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/github/status');
      const data = await response.json();
      setAuthStatus(data);
    } catch (error) {
      setAuthStatus({ authenticated: false });
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleGitHubAuth = () => {
    window.location.href = '/api/auth/github?action=authorize';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/github/status', { method: 'DELETE' });
      setAuthStatus({ authenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleExport = async () => {
    if (!projectName) {
      setError('Please enter a project name');
      return;
    }

    if (!authStatus.authenticated || !authStatus.token || !authStatus.username) {
      setError('Please authenticate with GitHub first');
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
          githubToken: authStatus.token,
          githubUsername: authStatus.username
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

              {/* GitHub Authentication Section */}
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium">GitHub Authentication</Label>
                {checkingAuth ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking authentication...
                  </div>
                ) : authStatus.authenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Authenticated as <strong>{authStatus.username}</strong>
                    </div>
                    <Button onClick={handleLogout} className="border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 text-sm px-3 py-1">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Sign in with GitHub to automatically create and deploy your repository
                    </p>
                    <Button onClick={handleGitHubAuth} className="w-full">
                      <Github className="w-4 h-4 mr-2" />
                      Sign in with GitHub
                    </Button>
                  </div>
                )}
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

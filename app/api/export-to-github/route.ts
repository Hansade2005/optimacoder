import { NextRequest, NextResponse } from 'next/server';
import { generateFrameworkStructure, ExportConfig } from '@/lib/utils';
import { Octokit } from '@octokit/rest';

export async function POST(request: NextRequest) {
  try {
    const { 
      framework, 
      projectName, 
      componentCode, 
      language, 
      githubToken,
      githubUsername 
    }: ExportConfig & { 
      githubToken: string; 
      githubUsername: string; 
    } = await request.json();

    // Validate inputs
    if (!framework || !projectName || !componentCode || !githubToken || !githubUsername) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: githubToken,
    });

    // Generate project structure
    const projectStructure = generateFrameworkStructure({
      framework,
      projectName,
      componentCode,
      language
    });

    // Create GitHub repository
    const repoResponse = await octokit.repos.createForAuthenticatedUser({
      name: projectName,
      description: `Generated with LlamaCoder - ${framework} project`,
      private: false,
      auto_init: false
    });

    const repoUrl = repoResponse.data.html_url;
    const defaultBranch = repoResponse.data.default_branch;

    // Upload files to repository
    for (const [filePath, content] of Object.entries(projectStructure)) {
      await octokit.repos.createOrUpdateFileContents({
        owner: githubUsername,
        repo: projectName,
        path: filePath,
        message: `Add ${filePath}`,
        content: Buffer.from(content).toString('base64'),
        branch: defaultBranch
      });
    }

    // Create Vercel deployment instructions
    const deploymentInstructions = {
      vercelDeploy: {
        steps: [
          'Connect your GitHub repository to Vercel',
          'Import the project at https://vercel.com/new',
          'Select the repository and deploy'
        ],
        directLink: `https://vercel.com/new/git/external?repository-url=${encodeURIComponent(repoUrl)}`
      }
    };

    return NextResponse.json({
      success: true,
      repoUrl,
      deploymentInstructions,
      message: `Successfully created ${framework} project and pushed to GitHub!`
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export to GitHub' },
      { status: 500 }
    );
  }
}

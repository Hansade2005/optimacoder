import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const githubToken = request.cookies.get('github_token')?.value;
  const githubUsername = request.cookies.get('github_username')?.value;

  if (!githubToken || !githubUsername) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Verify the token is still valid
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const userData = await response.json();

    return NextResponse.json({
      authenticated: true,
      username: userData.login,
      token: githubToken
    });

  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('github_token');
  response.cookies.delete('github_username');
  return response;
}

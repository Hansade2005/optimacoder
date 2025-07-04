import { NextRequest, NextResponse } from 'next/server';

// GitHub OAuth App configuration
const GITHUB_CLIENT_ID = 'Ov23li8qwE4pAi1Foftn';
const GITHUB_CLIENT_SECRET = '5ecd58280c67c1a128598cd2580fc01c6d328c46';
const REDIRECT_URI = 'https://optimacoder.vercel.app/api/auth/github/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'authorize') {
    // Redirect to GitHub OAuth authorization
    const scopes = 'repo user:email'; // Request repo access and user email
    const state = crypto.randomUUID(); // Generate random state for security
    
    // Store state in a secure way (you might want to use a database or session)
    // For now, we'll use a cookie
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
    
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600 // 10 minutes
    });
    
    return response;
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

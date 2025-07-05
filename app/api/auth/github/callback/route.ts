import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = 'Ov23li8qwE4pAi1Foftn';
const GITHUB_CLIENT_SECRET = '5ecd58280c67c1a128598cd2580fc01c6d328c46';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  // Verify state parameter
  const storedState = request.cookies.get('github_oauth_state')?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect('/?error=invalid_state');
  }

  if (!code) {
    return NextResponse.redirect('/?error=no_code');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      return NextResponse.redirect('/?error=oauth_failed');
    }

    const accessToken = tokenData.access_token;

    // Get user information
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    // Redirect back to the main app with the token and user info
    // In a real app, you'd want to store this securely (encrypted session, database, etc.)
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('github_auth_success', 'true');
    redirectUrl.searchParams.set('github_token', accessToken);
    redirectUrl.searchParams.set('github_username', userData.login);

    const response = NextResponse.redirect(redirectUrl);
    
    // Clear the OAuth state cookie
    response.cookies.delete('github_oauth_state');
    
    // Set secure cookies with the auth data (encrypted in production)
    response.cookies.set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    response.cookies.set('github_username', userData.login, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect('/?error=callback_failed');
  }
}

import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_AUTH_URL = 'https://airtable.com/oauth2/v1/authorize'

export async function GET(request: NextRequest) {
  const clientId = process.env.AIRTABLE_CLIENT_ID
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'AIRTABLE_CLIENT_ID not configured' },
      { status: 500 }
    )
  }

  const redirectUri = process.env.AIRTABLE_REDIRECT_URI || 
    `${request.nextUrl.origin}/api/auth/airtable/callback`
  
  // State para prevenir CSRF
  const state = crypto.randomUUID()
  
  // PKCE
  const codeVerifier = crypto.randomUUID() + crypto.randomUUID()
  const codeChallenge = Buffer.from(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
  ).toString('base64url')
  
  const scope = 'data.records:read data.records:write schema.bases:read'
  
  const authUrl = `${AIRTABLE_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${encodeURIComponent(scope)}`
  
  const response = NextResponse.redirect(authUrl)
  
  response.cookies.set('airtable_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  })
  
  response.cookies.set('airtable_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  })
  
  return response
}

import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_TOKEN_URL = 'https://airtable.com/oauth2/v1/token'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  
  if (error) {
    return NextResponse.json(
      { error: `Airtable OAuth error: ${error}` },
      { status: 400 }
    )
  }
  
  const savedState = request.cookies.get('airtable_oauth_state')?.value
  if (!state || state !== savedState) {
    return NextResponse.json(
      { error: 'Invalid state parameter' },
      { status: 400 }
    )
  }
  
  const codeVerifier = request.cookies.get('airtable_code_verifier')?.value
  if (!codeVerifier) {
    return NextResponse.json(
      { error: 'Code verifier not found' },
      { status: 400 }
    )
  }
  
  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code not provided' },
      { status: 400 }
    )
  }
  
  const clientId = process.env.AIRTABLE_CLIENT_ID
  const clientSecret = process.env.AIRTABLE_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Airtable credentials not configured' },
      { status: 500 }
    )
  }
  
  try {
    const response = await fetch(AIRTABLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI || 
          `${request.nextUrl.origin}/api/auth/airtable/callback`,
        code_verifier: codeVerifier,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error_description || 'Token exchange failed')
    }
    
    const data = await response.json()
    
    // TODO: Guardar tokens en base de datos
    // data.access_token, data.refresh_token, data.scope
    
    const redirectResponse = NextResponse.redirect(
      `${request.nextUrl.origin}/dashboard?airtable=connected`
    )
    
    redirectResponse.cookies.delete('airtable_oauth_state')
    redirectResponse.cookies.delete('airtable_code_verifier')
    
    return redirectResponse
    
  } catch (error) {
    console.error('Airtable OAuth error:', error)
    return NextResponse.json(
      { error: 'Failed to complete OAuth flow' },
      { status: 500 }
    )
  }
}

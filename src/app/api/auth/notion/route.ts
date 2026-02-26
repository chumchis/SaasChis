import { NextRequest, NextResponse } from 'next/server'

const NOTION_AUTH_URL = 'https://api.notion.com/v1/oauth/authorize'

export async function GET(request: NextRequest) {
  const clientId = process.env.NOTION_CLIENT_ID
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'NOTION_CLIENT_ID not configured' },
      { status: 500 }
    )
  }

  const redirectUri = process.env.NOTION_REDIRECT_URI || 
    `${request.nextUrl.origin}/api/auth/notion/callback`
  
  // State para prevenir CSRF
  const state = crypto.randomUUID()
  
  // Guardar state en cookie (temporal)
  const response = NextResponse.redirect(
    `${NOTION_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}&owner=user`
  )
  
  response.cookies.set('notion_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10 minutos
    path: '/',
  })
  
  return response
}

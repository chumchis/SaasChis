import { NextRequest, NextResponse } from 'next/server'

const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  
  // Verificar errores de Notion
  if (error) {
    return NextResponse.json(
      { error: `Notion OAuth error: ${error}` },
      { status: 400 }
    )
  }
  
  // Verificar state (CSRF protection)
  const savedState = request.cookies.get('notion_oauth_state')?.value
  if (!state || state !== savedState) {
    return NextResponse.json(
      { error: 'Invalid state parameter' },
      { status: 400 }
    )
  }
  
  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code not provided' },
      { status: 400 }
    )
  }
  
  const clientId = process.env.NOTION_CLIENT_ID
  const clientSecret = process.env.NOTION_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Notion credentials not configured' },
      { status: 500 }
    )
  }
  
  try {
    // Intercambiar code por access_token
    const response = await fetch(NOTION_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI || 
          `${request.nextUrl.origin}/api/auth/notion/callback`,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error_description || 'Token exchange failed')
    }
    
    const data = await response.json()
    
    // TODO: Guardar tokens en base de datos
    // data.access_token, data.workspace_id, data.workspace_name, data.bot_id
    
    // Redirigir al dashboard con éxito
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const redirectResponse = NextResponse.redirect(
      `${appUrl}/dashboard?notion=connected`
    )
    
    // Limpiar cookie de state
    redirectResponse.cookies.delete('notion_oauth_state')
    
    return redirectResponse
    
  } catch (error) {
    console.error('Notion OAuth error:', error)
    return NextResponse.json(
      { error: 'Failed to complete OAuth flow' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  
  // Eliminar cookie del token
  response.cookies.delete('notion_token')
  
  return response
}
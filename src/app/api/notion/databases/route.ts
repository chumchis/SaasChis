import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const notionToken = request.cookies.get('notion_token')?.value
    
    if (!notionToken) {
      return NextResponse.json(
        { error: 'Notion no conectado' },
        { status: 401 }
      )
    }

    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          value: 'database',
          property: 'object'
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Notion API error:', error)
      return NextResponse.json(
        { error: 'Error al obtener bases de Notion' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    const databases = data.results.map((db: any) => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || 'Sin título',
    }))

    return NextResponse.json({ databases })
  } catch (error) {
    console.error('Error fetching Notion databases:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
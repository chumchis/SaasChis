import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const databaseId = searchParams.get('id')
    
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Se requiere databaseId' },
        { status: 400 }
      )
    }

    const notionToken = request.cookies.get('notion_token')?.value
    
    if (!notionToken) {
      return NextResponse.json(
        { error: 'Notion no conectado' },
        { status: 401 }
      )
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Notion API error:', error)
      return NextResponse.json(
        { error: 'Error al obtener schema de Notion' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extraer propiedades relevantes
    const properties = Object.entries(data.properties || {}).map(([name, prop]: [string, any]) => ({
      name,
      type: prop.type,
      id: prop.id,
    }))

    return NextResponse.json({
      id: data.id,
      title: data.title?.[0]?.plain_text || 'Sin título',
      properties,
    })
  } catch (error) {
    console.error('Error fetching Notion schema:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
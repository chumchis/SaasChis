import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const baseId = searchParams.get('baseId')
    
    if (!baseId) {
      return NextResponse.json(
        { error: 'Se requiere baseId' },
        { status: 400 }
      )
    }

    const airtableToken = request.cookies.get('airtable_token')?.value
    
    if (!airtableToken) {
      return NextResponse.json(
        { error: 'Airtable no conectado' },
        { status: 401 }
      )
    }

    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${airtableToken}`,
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Airtable API error:', error)
      return NextResponse.json(
        { error: 'Error al obtener tablas de Airtable' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Tomar la primera tabla por defecto (o podríamos dejar elegir)
    const tables = data.tables.map((table: any) => ({
      id: table.id,
      name: table.name,
      fields: table.fields.map((field: any) => ({
        id: field.id,
        name: field.name,
        type: field.type,
      })),
    }))

    return NextResponse.json({ tables })
  } catch (error) {
    console.error('Error fetching Airtable tables:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
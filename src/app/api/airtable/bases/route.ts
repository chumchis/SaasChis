import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const airtableToken = request.cookies.get('airtable_token')?.value
    
    if (!airtableToken) {
      return NextResponse.json(
        { error: 'Airtable no conectado' },
        { status: 401 }
      )
    }

    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${airtableToken}`,
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Airtable API error:', error)
      return NextResponse.json(
        { error: 'Error al obtener bases de Airtable' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    const bases = data.bases.map((base: any) => ({
      id: base.id,
      name: base.name,
    }))

    return NextResponse.json({ bases })
  } catch (error) {
    console.error('Error fetching Airtable bases:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
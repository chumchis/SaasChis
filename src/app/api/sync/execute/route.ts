import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { syncId, fieldMapping } = body

    if (!syncId) {
      return NextResponse.json(
        { error: 'Se requiere syncId' },
        { status: 400 }
      )
    }

    const notionToken = request.cookies.get('notion_token')?.value
    const airtableToken = request.cookies.get('airtable_token')?.value

    if (!notionToken || !airtableToken) {
      return NextResponse.json(
        { error: 'Ambas conexiones son requeridas' },
        { status: 401 }
      )
    }

    // Obtener configuración de la sync
    const syncData = await redis.get(`sync:${syncId}`)
    if (!syncData) {
      return NextResponse.json(
        { error: 'Sincronización no encontrada' },
        { status: 404 }
      )
    }

    const sync = typeof syncData === 'string' ? JSON.parse(syncData) : syncData

    // 1. Obtener registros de Notion
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${sync.notionDatabaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 }),
    })

    if (!notionResponse.ok) {
      const error = await notionResponse.json()
      console.error('Notion query error:', error)
      return NextResponse.json(
        { error: 'Error al leer datos de Notion' },
        { status: notionResponse.status }
      )
    }

    const notionData = await notionResponse.json()
    const records = notionData.results || []

    // 2. Obtener primera tabla de Airtable
    const tablesResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${sync.airtableBaseId}/tables`, {
      headers: { 'Authorization': `Bearer ${airtableToken}` },
    })

    if (!tablesResponse.ok) {
      return NextResponse.json(
        { error: 'Error al obtener tablas de Airtable' },
        { status: tablesResponse.status }
      )
    }

    const tablesData = await tablesResponse.json()
    const firstTable = tablesData.tables?.[0]

    if (!firstTable) {
      return NextResponse.json(
        { error: 'No se encontraron tablas en la base de Airtable' },
        { status: 400 }
      )
    }

    // 3. Transformar y enviar datos a Airtable
    const airtableRecords = records.map((page: any) => {
      const fields: Record<string, any> = {}
      
      // Mapear campos según fieldMapping
      if (fieldMapping) {
        Object.entries(fieldMapping).forEach(([notionField, airtableField]) => {
          const notionValue = page.properties[notionField]
          if (notionValue) {
            fields[airtableField as string] = extractNotionValue(notionValue)
          }
        })
      }

      // Siempre incluir el título/nombre si existe
      const titleProp = Object.values(page.properties).find((p: any) => p.type === 'title') as any
      if (titleProp && titleProp.title?.[0]?.plain_text) {
        fields['Name'] = titleProp.title[0].plain_text
      }

      return { fields }
    }).filter((r: any) => Object.keys(r.fields).length > 0)

    // 4. Crear registros en Airtable (en batches de 10)
    const results = []
    for (let i = 0; i < airtableRecords.length; i += 10) {
      const batch = airtableRecords.slice(i, i + 10)
      
      const createResponse = await fetch(`https://api.airtable.com/v0/${sync.airtableBaseId}/${firstTable.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: batch }),
      })

      if (createResponse.ok) {
        const result = await createResponse.json()
        results.push(...result.records)
      } else {
        const error = await createResponse.json()
        console.error('Airtable create error:', error)
      }
    }

    // Guardar log de la ejecución
    const executionId = `exec_${Date.now()}`
    await redis.set(`execution:${executionId}`, JSON.stringify({
      id: executionId,
      syncId,
      recordsProcessed: records.length,
      recordsCreated: results.length,
      executedAt: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      recordsProcessed: records.length,
      recordsCreated: results.length,
      executionId,
    })

  } catch (error) {
    console.error('Error executing sync:', error)
    return NextResponse.json(
      { error: 'Error al ejecutar la sincronización' },
      { status: 500 }
    )
  }
}

function extractNotionValue(property: any): any {
  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || ''
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || ''
    case 'number':
      return property.number
    case 'select':
      return property.select?.name || ''
    case 'multi_select':
      return property.multi_select?.map((s: any) => s.name) || []
    case 'date':
      return property.date?.start || ''
    case 'checkbox':
      return property.checkbox
    case 'email':
      return property.email || ''
    case 'url':
      return property.url || ''
    default:
      return ''
  }
}
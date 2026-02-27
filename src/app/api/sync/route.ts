import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(request: NextRequest) {
  try {
    const notionToken = request.cookies.get('notion_token')?.value
    const airtableToken = request.cookies.get('airtable_token')?.value

    // Obtener lista de sync IDs
    const syncIds = await redis.lrange('user:syncs', 0, -1)
    
    const syncs = []
    for (const id of syncIds) {
      const syncData = await redis.get(`sync:${id}`)
      if (syncData) {
        const sync = typeof syncData === 'string' ? JSON.parse(syncData) : syncData
        
        // Enriquecer con nombres si tenemos tokens
        if (notionToken && airtableToken) {
          // Obtener nombre de base de Notion
          try {
            const notionRes = await fetch(`https://api.notion.com/v1/databases/${sync.notionDatabaseId}`, {
              headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
              }
            })
            if (notionRes.ok) {
              const notionData = await notionRes.json()
              sync.notionDatabaseName = notionData.title?.[0]?.plain_text || 'Base de Notion'
            }
          } catch (e) {
            sync.notionDatabaseName = 'Base de Notion'
          }

          // Obtener nombre de base de Airtable
          try {
            const airtableRes = await fetch(`https://api.airtable.com/v0/meta/bases/${sync.airtableBaseId}`, {
              headers: { 'Authorization': `Bearer ${airtableToken}` }
            })
            if (airtableRes.ok) {
              const airtableData = await airtableRes.json()
              sync.airtableBaseName = airtableData.name || 'Base de Airtable'
            }
          } catch (e) {
            sync.airtableBaseName = 'Base de Airtable'
          }
        }
        
        syncs.push(sync)
      }
    }

    return NextResponse.json({ syncs })
  } catch (error) {
    console.error('Error fetching syncs:', error)
    return NextResponse.json(
      { error: 'Error al obtener sincronizaciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notionDatabaseId, airtableBaseId } = body

    if (!notionDatabaseId || !airtableBaseId) {
      return NextResponse.json(
        { error: 'Se requieren notionDatabaseId y airtableBaseId' },
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

    // Crear un ID único para la sincronización
    const syncId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Guardar la configuración de sincronización en Redis
    const syncConfig = {
      id: syncId,
      notionDatabaseId,
      airtableBaseId,
      createdAt: new Date().toISOString(),
      status: 'active',
    }

    await redis.set(`sync:${syncId}`, JSON.stringify(syncConfig))
    
    // También guardar en una lista de sincronizaciones del usuario
    await redis.lpush('user:syncs', syncId)

    return NextResponse.json({
      success: true,
      syncId,
      message: 'Sincronización creada exitosamente',
    })
  } catch (error) {
    console.error('Error creating sync:', error)
    return NextResponse.json(
      { error: 'Error al crear la sincronización' },
      { status: 500 }
    )
  }
}
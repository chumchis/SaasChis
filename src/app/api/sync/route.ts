import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

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
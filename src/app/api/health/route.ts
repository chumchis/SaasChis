import { NextResponse } from 'next/server'
import { redis, checkRedisConnection } from '@/lib/redis'
import { qstash } from '@/lib/qstash'

export async function GET() {
  const checks = {
    redis: { ok: false, error: null as string | null },
    qstash: { ok: false, error: null as string | null },
    timestamp: new Date().toISOString(),
  }

  // Check Redis
  const redisCheck = await checkRedisConnection()
  checks.redis = redisCheck

  // Check QStash (verificar que el token está configurado)
  try {
    if (process.env.UPSTASH_QSTASH_TOKEN) {
      checks.qstash.ok = true
    } else {
      checks.qstash.error = 'QStash token not configured'
    }
  } catch (error) {
    checks.qstash.error = String(error)
  }

  const allOk = checks.redis.ok && checks.qstash.ok

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'unhealthy',
      checks,
    },
    { status: allOk ? 200 : 503 }
  )
}

import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Helper para verificar conexión
export async function checkRedisConnection() {
  try {
    await redis.ping()
    return { ok: true, error: null }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

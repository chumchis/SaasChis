import { Client as QStashClient } from '@upstash/qstash'

export const qstash = new QStashClient({
  token: process.env.UPSTASH_QSTASH_TOKEN || '',
})

// Tipos de jobs
export type JobType = 
  | 'sync.notion-to-airtable'
  | 'sync.airtable-to-notion'
  | 'webhook.process'

interface JobPayload {
  type: JobType
  userId: string
  data: Record<string, unknown>
}

// Publicar job a la cola
export async function publishJob(payload: JobPayload, delaySeconds?: number) {
  return qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs`,
    body: payload,
    delay: delaySeconds,
  })
}

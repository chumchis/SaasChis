// ==========================================
// Constantes de Configuración de SyncBridge
// ==========================================

// ------------------------------------------
// App
// ------------------------------------------
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SyncBridge';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ------------------------------------------
// OAuth Providers
// ------------------------------------------
export const OAUTH_PROVIDERS = {
  AIRTABLE: {
    name: 'airtable',
    authorizationUrl: 'https://airtable.com/oauth2/v1/authorize',
    tokenUrl: 'https://airtable.com/oauth2/v1/token',
    scopes: ['data.records:read', 'data.records:write', 'schema.bases:read', 'webhook:manage'],
  },
  NOTION: {
    name: 'notion',
    authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    scopes: ['read_content', 'write_content', 'read_user'],
  },
} as const;

// ------------------------------------------
// API Endpoints Externos
// ------------------------------------------
export const EXTERNAL_APIS = {
  AIRTABLE: {
    baseUrl: 'https://api.airtable.com/v0',
    metaUrl: 'https://api.airtable.com/v0/meta',
    webhookUrl: 'https://api.airtable.com/v0/bases/{baseId}/webhooks',
  },
  NOTION: {
    baseUrl: 'https://api.notion.com/v1',
    version: '2022-06-28',
  },
} as const;

// ------------------------------------------
// Rate Limits
// ------------------------------------------
export const RATE_LIMITS = {
  AIRTABLE: {
    requestsPerSecond: 5,
    requestsPerMonth: 1000, // Free tier
    burstSize: 10,
    retryAttempts: 5,
    baseDelayMs: 1000,
    maxDelayMs: 60000,
  },
  NOTION: {
    requestsPerSecond: 3,
    burstSize: 5,
    retryAttempts: 5,
    baseDelayMs: 1000,
    maxDelayMs: 60000,
  },
} as const;

// ------------------------------------------
// Redis Keys
// ------------------------------------------
export const REDIS_KEYS = {
  USER: (userId: string) => `user:${userId}`,
  USER_CONNECTIONS: (userId: string) => `user:${userId}:connections`,
  OAUTH_TOKEN: (userId: string, provider: string) => `oauth:${provider}:${userId}`,
  SYNC_CONFIG: (configId: string) => `sync:${configId}`,
  USER_SYNCS: (userId: string) => `user:${userId}:syncs`,
  SYNC_JOB: (jobId: string) => `job:${jobId}`,
  SYNC_JOBS: (configId: string) => `sync:${configId}:jobs`,
  WEBHOOK: (webhookId: string) => `webhook:${webhookId}`,
  RATE_LIMIT: (provider: string, userId: string) => `ratelimit:${provider}:${userId}`,
  SESSION: (sessionId: string) => `session:${sessionId}`,
  CACHE: (key: string) => `cache:${key}`,
} as const;

// ------------------------------------------
// TTLs (Time To Live en segundos)
// ------------------------------------------
export const REDIS_TTL = {
  SESSION: 60 * 60 * 24 * 7, // 7 días
  OAUTH_TOKEN: 60 * 60 * 24, // 24 horas
  CACHE: 60 * 5, // 5 minutos
  RATE_LIMIT: 60, // 1 minuto
  SYNC_JOB: 60 * 60 * 24 * 30, // 30 días
} as const;

// ------------------------------------------
// Sync Configuration
// ------------------------------------------
export const SYNC_CONFIG = {
  MAX_RECORDS_PER_BATCH: 100,
  MAX_CONCURRENT_SYNCS: 3,
  SYNC_TIMEOUT_MS: 5 * 60 * 1000, // 5 minutos
  WEBHOOK_RETRY_ATTEMPTS: 3,
  WEBHOOK_TIMEOUT_MS: 30000,
  DEFAULT_TIMEZONE: 'America/New_York',
} as const;

// ------------------------------------------
// Subscription Tiers
// ------------------------------------------
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'free',
    maxSyncs: 2,
    maxRecordsPerSync: 1000,
    syncFrequency: ['manual', 'daily'],
    features: ['basic_sync', 'email_support'],
  },
  PRO: {
    name: 'pro',
    maxSyncs: 10,
    maxRecordsPerSync: 10000,
    syncFrequency: ['manual', 'hourly', 'daily', 'weekly'],
    features: ['advanced_sync', 'webhooks', 'priority_support', 'field_transformations'],
  },
  ENTERPRISE: {
    name: 'enterprise',
    maxSyncs: 100,
    maxRecordsPerSync: 100000,
    syncFrequency: ['manual', 'realtime', 'hourly', 'daily', 'weekly'],
    features: ['all_features', 'dedicated_support', 'custom_integrations', 'sla'],
  },
} as const;

// ------------------------------------------
// Error Codes
// ------------------------------------------
export const ERROR_CODES = {
  // Autenticación
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_PROVIDER_ERROR: 'AUTH_PROVIDER_ERROR',

  // Rate Limit
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_PROVIDER: 'RATE_LIMIT_PROVIDER',

  // Sync
  SYNC_NOT_FOUND: 'SYNC_NOT_FOUND',
  SYNC_ALREADY_RUNNING: 'SYNC_ALREADY_RUNNING',
  SYNC_CONFIG_INVALID: 'SYNC_CONFIG_INVALID',
  SYNC_PROVIDER_ERROR: 'SYNC_PROVIDER_ERROR',
  SYNC_MAPPING_INVALID: 'SYNC_MAPPING_INVALID',

  // Validación
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Suscripción
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  SUBSCRIPTION_LIMIT_EXCEEDED: 'SUBSCRIPTION_LIMIT_EXCEEDED',

  // Servidor
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// ------------------------------------------
// HTTP Status Codes
// ------------------------------------------
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMIT: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ------------------------------------------
// Logging
// ------------------------------------------
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
} as const;

export const LOG_COLORS = {
  ERROR: '\x1b[31m', // Rojo
  WARN: '\x1b[33m',  // Amarillo
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m',
} as const;

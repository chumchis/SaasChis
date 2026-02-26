// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface ConnectedAccount {
  id: string
  provider: 'airtable' | 'notion'
  connected: boolean
  accountName?: string
  accountEmail?: string
  connectedAt?: Date
}

// ============================================
// AIRTABLE TYPES
// ============================================

export interface AirtableBase {
  id: string
  name: string
  tables: AirtableTable[]
}

export interface AirtableTable {
  id: string
  name: string
  fields: AirtableField[]
}

export interface AirtableField {
  id: string
  name: string
  type: AirtableFieldType
  options?: Record<string, unknown>
}

export type AirtableFieldType =
  | 'singleLineText'
  | 'email'
  | 'url'
  | 'multilineText'
  | 'number'
  | 'percent'
  | 'currency'
  | 'singleSelect'
  | 'multipleSelects'
  | 'singleCollaborator'
  | 'multipleCollaborators'
  | 'multipleRecordLinks'
  | 'date'
  | 'dateTime'
  | 'phoneNumber'
  | 'multipleAttachments'
  | 'checkbox'
  | 'formula'
  | 'createdTime'
  | 'rollup'
  | 'count'
  | 'lookup'
  | 'multipleLookupValues'
  | 'autoNumber'
  | 'barcode'
  | 'rating'
  | 'richText'
  | 'duration'
  | 'lastModifiedTime'
  | 'button'
  | 'createdBy'
  | 'lastModifiedBy'
  | 'externalSyncSource'

// ============================================
// NOTION TYPES
// ============================================

export interface NotionWorkspace {
  id: string
  name: string
  databases: NotionDatabase[]
}

export interface NotionDatabase {
  id: string
  title: string
  properties: NotionProperty[]
}

export interface NotionProperty {
  id: string
  name: string
  type: NotionPropertyType
  config?: Record<string, unknown>
}

export type NotionPropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'people'
  | 'files'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by'
  | 'status'
  | 'unique_id'
  | 'verification'

// ============================================
// SYNC TYPES
// ============================================

export type SyncStatus = 
  | 'active'
  | 'paused'
  | 'error'
  | 'syncing'
  | 'inactive'

export type SyncDirection = 
  | 'airtable_to_notion'
  | 'notion_to_airtable'
  | 'bidirectional'

export type SyncFrequency = 
  | 'realtime'
  | '5min'
  | '15min'
  | '30min'
  | '1hour'
  | '6hours'
  | '12hours'
  | 'daily'
  | 'weekly'

export interface SyncConfig {
  id: string
  name: string
  description?: string
  status: SyncStatus
  direction: SyncDirection
  frequency: SyncFrequency
  createdAt: Date
  updatedAt: Date
  lastSyncAt?: Date
  nextSyncAt?: Date
  source: {
    type: 'airtable'
    baseId: string
    baseName: string
    tableId: string
    tableName: string
  }
  target: {
    type: 'notion'
    databaseId: string
    databaseName: string
  }
  fieldMappings: FieldMapping[]
  stats: SyncStats
}

export interface FieldMapping {
  id: string
  sourceField: {
    id: string
    name: string
    type: string
  }
  targetField: {
    id: string
    name: string
    type: string
  }
  transformations?: FieldTransformation[]
}

export interface FieldTransformation {
  type: 'uppercase' | 'lowercase' | 'trim' | 'replace' | 'format_date' | 'custom'
  config?: Record<string, unknown>
}

export interface SyncStats {
  totalRecords: number
  syncedRecords: number
  pendingRecords: number
  errorRecords: number
  lastSyncDuration?: number
  totalSyncs: number
}

// ============================================
// SYNC LOG TYPES
// ============================================

export type LogLevel = 'info' | 'warning' | 'error' | 'success'

export type LogEventType =
  | 'sync_started'
  | 'sync_completed'
  | 'sync_failed'
  | 'record_created'
  | 'record_updated'
  | 'record_deleted'
  | 'record_error'
  | 'field_mapped'
  | 'connection_error'
  | 'rate_limited'

export interface SyncLog {
  id: string
  syncId: string
  timestamp: Date
  level: LogLevel
  eventType: LogEventType
  message: string
  details?: Record<string, unknown>
  recordId?: string
  fieldName?: string
}

// ============================================
// BILLING TYPES
// ============================================

export type PlanType = 'free' | 'starter' | 'professional' | 'enterprise'

export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid'

export interface Plan {
  id: string
  name: string
  type: PlanType
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: PlanFeature[]
  limits: PlanLimits
  popular?: boolean
}

export interface PlanFeature {
  name: string
  included: boolean
  limit?: number | string
}

export interface PlanLimits {
  maxSyncs: number
  maxRecords: number
  maxFrequency: SyncFrequency
  apiCallsPerMonth: number
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
}

export interface Subscription {
  id: string
  plan: Plan
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
  stripeCustomerId?: string
}

export interface UsageStats {
  syncsUsed: number
  syncsLimit: number
  recordsUsed: number
  recordsLimit: number
  apiCallsUsed: number
  apiCallsLimit: number
  periodStart: Date
  periodEnd: Date
}

// ============================================
// UI TYPES
// ============================================

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
  active?: boolean
}

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
  icon?: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// ============================================
// AUTH TYPES
// ============================================

export interface OAuthToken {
  provider: 'airtable' | 'notion'
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  scope: string
  tokenType: string
}

export interface UserConnections {
  userId: string
  airtable?: {
    connected: boolean
    token: OAuthToken
    metadata?: Record<string, unknown>
  }
  notion?: {
    connected: boolean
    token: OAuthToken
    metadata?: Record<string, unknown>
  }
}

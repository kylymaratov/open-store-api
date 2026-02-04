import { TRole } from './role.types'

export interface TSession {
  sessionId: string
  metadata: TSessionMetadata
  identify?: TSessionIdentify
}

export interface TSessionIdentify {
  id: number
  name: string
  email: string
  role: TRole
}

export interface TSessionMetadata {
  ip: string
  userAgent: string
  lastActive: string
  expireAt: string
}

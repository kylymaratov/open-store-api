import { TRole } from '@/@types/shared/role.types'
import { TSession, TSessionIdentify } from '@/@types/shared/session.types'
import { CacherService } from '@/common/tools/cacher/cacher.service'
import { HelperService } from '@/common/tools/helper/helper.service'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import { Request } from 'express'

@Injectable()
export class SessionService {
  constructor(
    @Inject(CacherService) private cacher: CacherService,
    @Inject(ConfigService) private config: ConfigService,
    @Inject(HelperService) private helper: HelperService,
  ) {}

  private readonly DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000
  private readonly LOCK_TTL_MS = 5_000

  private getSessionKey = (sessionId: string) => `session:${sessionId}`

  private getOwnerKey = (role: TRole, identifyId: number) =>
    `session-owner:${role}:${identifyId}`

  getSessionTtlMs() {
    return this.config.get<number>('SESSION_TTL_MS') ?? this.DEFAULT_TTL_MS
  }

  async getCurrentSession(sessionId: string): Promise<TSession | null> {
    return this.cacher.get<TSession>(this.getSessionKey(sessionId))
  }

  async createGuestSession(req: Request) {
    return this.createNewSession(req)
  }

  async createNewSession(
    req: Request,
    identify?: TSessionIdentify,
  ): Promise<string> {
    const sessionId = crypto.randomUUID()
    const now = new Date()
    const ttlMs = this.getSessionTtlMs()
    const expireAt = new Date(now.getTime() + ttlMs).toISOString()

    const { ip, userAgent } = this.helper.readHeaders(req)
    const session: TSession = {
      sessionId,
      metadata: {
        ip,
        userAgent,
        lastActive: now.toISOString(),
        expireAt,
      },
      identify,
    }

    await this.cacher.set(this.getSessionKey(sessionId), session, ttlMs)

    if (identify) {
      const ownerKey = this.getOwnerKey(identify.role, identify.id)
      const lock = await this.cacher.lock(ownerKey, this.LOCK_TTL_MS)
      try {
        const oldSessionId = await this.cacher.get<string>(ownerKey)
        if (oldSessionId) {
          await this.cacher.del(this.getSessionKey(oldSessionId))
        }
        await this.cacher.set(ownerKey, sessionId, ttlMs)
      } finally {
        await this.cacher.release(lock)
      }
    }

    return sessionId
  }

  async updateExistsSession(sessionId: string, req: Request) {
    const session = await this.getCurrentSession(sessionId)
    if (!session) return false

    const ttlMs = this.getSessionTtlMs()
    const now = new Date()
    const expireAt = new Date(now.getTime() + ttlMs).toISOString()
    const { ip, userAgent } = this.helper.readHeaders(req)

    session.metadata = {
      ...session.metadata,
      ip,
      userAgent,
      lastActive: now.toISOString(),
      expireAt,
    }

    await this.cacher.set(this.getSessionKey(sessionId), session, ttlMs)

    return true
  }

  async clearSession(session: TSession) {
    await this.cacher.del(this.getSessionKey(session.sessionId))
    if (session.identify) {
      const ownerKey = this.getOwnerKey(
        session.identify.role,
        session.identify.id,
      )
      await this.cacher.del(ownerKey)
    }
  }
}

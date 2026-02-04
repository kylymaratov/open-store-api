import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import Redlock from 'redlock'

@Injectable()
export class CacherService {
  constructor(
    @Inject('REDIS_CLIENT') private redis: Redis,
    @Inject('REDLOCK') private redlock: Redlock,
  ) {}

  async set<T>(key: string, data: T, ttlMs: number) {
    await this.redis.set(key, JSON.stringify(data), 'PX', ttlMs)
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const json = await this.redis.get(key)

      if (!json) throw new Error()

      const data = JSON.parse(json)

      return data as T
    } catch (error) {
      return null
    }
  }

  async lock(key: string, durationMs: number) {
    const lock = await this.redlock.acquire([key], durationMs)

    return lock
  }

  async release(lock: Redlock.Lock) {
    await this.redlock.release(lock)
  }

  async del(key: string) {
    await this.redis.del(key)
  }
}

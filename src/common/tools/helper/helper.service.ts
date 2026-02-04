import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

@Injectable()
export class HelperService {
  constructor(@Inject(ConfigService) private config: ConfigService) {}

  isValidUrl(string: string) {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  readHeaders(req: Request) {
    const sessionId = (req.cookies['sessionId'] as string) || ''
    const userAgent = (req.headers['user-agent'] as string) || ''
    const ip = ((req.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      .trim() ||
      req.socket.remoteAddress ||
      '') as string

    return { sessionId, userAgent, ip }
  }

  isDevMode() {
    return this.config.get<boolean>('isDev')
  }

  isBot(userAgent: string) {
    const normalized = (userAgent || '').toLowerCase()
    return /bot|crawl|spider|curl|wget|python|java|php|scrapy/.test(normalized)
  }
}

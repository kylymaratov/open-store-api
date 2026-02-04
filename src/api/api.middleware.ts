import { SessionService } from '@/modules/session/session.service'
import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  constructor(@Inject(SessionService) private session: SessionService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
    } finally {
      next()
    }
  }
}

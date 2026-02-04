import { SessionService } from '@/modules/session/session.service'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Request } from 'express'
import { HelperService } from '../tools/helper/helper.service'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @Inject(SessionService) private session: SessionService,
    @Inject(HelperService) private helper: HelperService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request
    const { sessionId } = this.helper.readHeaders(req)
    const session = this.session.getCurrentSession(sessionId)

    if (!session) return false

    return true
  }
}

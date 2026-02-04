import { TSession } from '@/@types/shared/session.types'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TSession | null => {
    const request = ctx.switchToHttp().getRequest()
    return request.session ?? null
  },
)

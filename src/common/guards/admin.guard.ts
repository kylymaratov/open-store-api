import { TJwtAdmin } from '@/@types/shared/jwt.types'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { PrismaService } from '../../databases/prisma/prisma.service'
import { JsonWebTokenService } from '../tools/jwt/jwt.service'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(JsonWebTokenService) private jwt: JsonWebTokenService,
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(ConfigService) private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request
      const token = request.headers['authorization']
      const accessToken = token?.replace('Bearer ', '')

      if (!accessToken) return false

      let decoded

      try {
        const adminSecret = this.config.get<string>('ADMIN_TOKEN_SECRET') || ''
        decoded = await this.jwt.verify<TJwtAdmin>(accessToken, adminSecret)
      } catch {
        const rootSecret = this.config.get<string>('ROOT_TOKEN_SECRET') || ''
        decoded = await this.jwt.verify<TJwtAdmin>(accessToken, rootSecret)
      }

      if (!decoded) return false

      const admin = await this.prisma.admin.findUnique({
        where: { email: decoded.email },
      })

      if (!admin) return false

      if (decoded.role !== 'admin' && decoded.role !== 'root') return false

      request.admin = { ...admin, password: '' }

      return true
    } catch (error) {
      return false
    }
  }
}

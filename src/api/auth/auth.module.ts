import { BcryptModule } from '@/common/tools/bcrypt/bcrypt.module'
import { HelperModule } from '@/common/tools/helper/helper.module'
import { JsonWebTokenModule } from '@/common/tools/jwt/jwt.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { SessionModule } from '@/modules/session/session.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthSessionMiddleware } from './middlewares/auth.session.middleware'
import { PrivateAuthService } from './services/private.auth.service'

@Module({
  imports: [JsonWebTokenModule, BcryptModule, SessionModule, HelperModule],
  providers: [AuthService, PrismaService, PrivateAuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthSessionMiddleware).forRoutes('/signin')
  }
}

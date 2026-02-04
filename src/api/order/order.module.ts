import { GenerateModule } from '@/common/tools/generate/generate.module'
import { HelperModule } from '@/common/tools/helper/helper.module'
import { JsonWebTokenModule } from '@/common/tools/jwt/jwt.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { SessionModule } from '@/modules/session/session.module'
import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [SessionModule, GenerateModule, JsonWebTokenModule, HelperModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}

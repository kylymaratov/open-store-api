import { GenerateModule } from '@/common/tools/generate/generate.module'
import { JsonWebTokenModule } from '@/common/tools/jwt/jwt.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { BannerController } from './banner.controller'
import { BannerService } from './banner.service'
import { PrivateBannerService } from './services/private.banner.service'

@Module({
  imports: [JsonWebTokenModule, GenerateModule],
  providers: [BannerService, PrivateBannerService, PrismaService],
  controllers: [BannerController],
})
export class BannerModule {}

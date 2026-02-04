import { BcryptModule } from '@/common/tools/bcrypt/bcrypt.module'
import { JsonWebTokenModule } from '@/common/tools/jwt/jwt.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
  imports: [JsonWebTokenModule, BcryptModule],
  providers: [AdminService, PrismaService],
  controllers: [AdminController],
})
export class AdminModule {}

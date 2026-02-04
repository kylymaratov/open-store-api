import { BcryptModule } from '@/common/tools/bcrypt/bcrypt.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { RootService } from './root.service'

@Module({
  imports: [BcryptModule],
  providers: [RootService, PrismaService],
})
export class RootModule {}

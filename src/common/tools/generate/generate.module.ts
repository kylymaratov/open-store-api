import { PrismaService } from '@/databases/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { GenerateService } from './generate.service'

@Module({
  providers: [GenerateService, PrismaService],
  exports: [GenerateService],
})
export class GenerateModule {}

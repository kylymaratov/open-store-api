import { CacherModule } from '@/common/tools/cacher/cacher.module'
import { HelperModule } from '@/common/tools/helper/helper.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { SessionService } from './session.service'

@Module({
  imports: [CacherModule, HelperModule],
  providers: [SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionModule {}

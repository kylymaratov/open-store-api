import { PrismaService } from '@/databases/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { SorterModule } from '@/common/tools/sorter/sorter.module'

@Module({
  imports: [SorterModule],
  controllers: [SearchController],
  providers: [SearchService, PrismaService],
})
export class SearchModule {}

import { CacherModule } from '@/common/tools/cacher/cacher.module'
import { GenerateModule } from '@/common/tools/generate/generate.module'
import { JsonWebTokenModule } from '@/common/tools/jwt/jwt.module'
import { SorterModule } from '@/common/tools/sorter/sorter.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { PrivateCategoryService } from './services/private.category.service'

@Module({
  imports: [JsonWebTokenModule, GenerateModule, SorterModule, CacherModule],
  providers: [CategoryService, PrivateCategoryService, PrismaService],
  controllers: [CategoryController],
})
export class CategoryModule {}

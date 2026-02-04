import { CacherModule } from '@/common/tools/cacher/cacher.module'
import { GenerateModule } from '@/common/tools/generate/generate.module'
import { HelperModule } from '@/common/tools/helper/helper.module'
import { JsonWebTokenModule } from '@/common/tools/jwt/jwt.module'
import { SorterModule } from '@/common/tools/sorter/sorter.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { SessionModule } from '@/modules/session/session.module'
import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { PrivateProductService } from './services/private.product.service'

@Module({
  imports: [
    JsonWebTokenModule,
    GenerateModule,
    SorterModule,
    SessionModule,
    CacherModule,
    HelperModule,
  ],
  providers: [ProductService, PrivateProductService, PrismaService],
  controllers: [ProductController],
})
export class ProductModule {}

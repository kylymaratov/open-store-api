import { PrismaService } from '@/databases/prisma/prisma.service'
import { SessionModule } from '@/modules/session/session.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AdminModule } from './admin/admin.module'
import { ApiMiddleware } from './api.middleware'
import { AuthModule } from './auth/auth.module'
import { BannerModule } from './banner/banner.module'
import { CategoryModule } from './category/category.module'
import { LogsModule } from './logs/logs.module'
import { OrderModule } from './order/order.module'
import { ProductModule } from './product/product.module'
import { SearchModule } from './search/search.module'
import { StorageModule } from './storage/storage.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    AdminModule,
    AuthModule,
    BannerModule,
    CategoryModule,
    ProductModule,
    SearchModule,
    StorageModule,
    UserModule,
    OrderModule,
    LogsModule,
    SessionModule,
  ],
  providers: [PrismaService],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes('/')
  }
}

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'
import globalConfig from './common/config/global.config'
import { RedisModule } from './databases/redis/redis.module'
import { RateLimitModule } from './modules/rate-limit/ratelimit.module'
import { RootModule } from './modules/root/root.module'
import { WrokerModule } from './modules/worker/worker.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig],
    }),
    ApiModule,
    RootModule,
    RedisModule,
    WrokerModule,
    RateLimitModule,
  ],
})
export class AppModule {}

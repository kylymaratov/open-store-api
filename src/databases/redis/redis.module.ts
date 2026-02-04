import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import Redlock from 'redlock'

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) => {
        return new Redis({
          host: config.get<string>('REDIS_HOST') ?? 'localhost',
          port: Number(config.get<number>('REDIS_PORT')) || 6379,
        })
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDLOCK',
      useFactory: (redisClient: Redis) => {
        // @ts-ignore
        return new Redlock([redisClient], {
          retryCount: 3,
          retryDelay: 200,
        })
      },
      inject: ['REDIS_CLIENT'],
    },
  ],
  exports: ['REDIS_CLIENT', 'REDLOCK'],
})
export class RedisModule {}

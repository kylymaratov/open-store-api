import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HelperService } from './helper.service'

@Module({
  imports: [ConfigModule],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}

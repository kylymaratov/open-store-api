import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JsonWebTokenService } from './jwt.service'

@Module({
  providers: [JsonWebTokenService, JwtService],
  exports: [JsonWebTokenService],
})
export class JsonWebTokenModule {}

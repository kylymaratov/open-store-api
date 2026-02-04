import { Module } from '@nestjs/common'
import { CacherService } from './cacher.service'

@Module({ providers: [CacherService], exports: [CacherService] })
export class CacherModule {}

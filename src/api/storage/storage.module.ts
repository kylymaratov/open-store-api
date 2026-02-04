import { GenerateModule } from '@/common/tools/generate/generate.module'
import { JsonWebTokenModule } from '@/common/tools/jwt/jwt.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module'
import { Module } from '@nestjs/common'
import { PrivateStorageService } from './services/private.storage.service'
import { StorageController } from './storage.controller'
import { StorageService } from './storage.service'

@Module({
  imports: [CloudinaryModule, GenerateModule, JsonWebTokenModule],
  providers: [StorageService, PrivateStorageService, PrismaService],
  controllers: [StorageController],
})
export class StorageModule {}

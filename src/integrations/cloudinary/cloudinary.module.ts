import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as cloudinary from 'cloudinary'
import { CloudinaryService } from './cloudinary.service'

@Module({
  providers: [
    {
      provide: 'Cloudinary',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        cloudinary.v2.config({
          cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME') as string,
          api_key: config.get<string>('CLOUDINARY_API_KEY') as string,
          api_secret: config.get<string>('CLOUDINARY_API_SECRET') as string,
        })
        return cloudinary
      },
    },
    CloudinaryService,
  ],
  exports: ['Cloudinary', CloudinaryService],
})
export class CloudinaryModule {}

import { CloudinaryFolder } from '@/@types/shared/cloudinarty.types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name)

  constructor(@Inject('Cloudinary') private readonly cloudinary: any) {}

  async uploadImage(
    image: Express.Multer.File,
    folder: CloudinaryFolder,
  ): Promise<{ url: string; publicId: string }> {
    try {
      const uploadPromise = new Promise<{ url: string; publicId: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: 'image',
            },
            (error, result) => {
              if (error) return reject(error)

              if (!result?.secure_url || !result.public_id)
                return reject(
                  new Error('Invalid upload result from Cloudinary'),
                )

              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              })
            },
          )

          Readable.from(image.buffer).pipe(uploadStream)
        },
      )

      return await uploadPromise
    } catch (error) {
      this.logger.log('Failed to upload image to Cloudinary')
      throw error
    }
  }

  async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      })
    } catch (error) {
      this.logger.error('Failed to delete image:', error)
      throw error
    }
  }
}

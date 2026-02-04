import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { GenerateService } from '@/common/tools/generate/generate.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { DeleteBannerImageByIdDto } from '../dto/deleteBannerImageById.dto'
import { DeleteProductImageByIdDto } from '../dto/deleteProductImageById.dto'
import { SetMainProductImageDto } from '../dto/setMainProductImage.dto'
import { UploadBannerImageDto } from '../dto/uploadBannerImage.dto'
import { UploadCategoryIconDto } from '../dto/uploadCategoryIcon.dto'
import { UploadProductImageDto } from '../dto/uploadProductImage.dto'

@Injectable()
export class PrivateStorageService {
  constructor(
    @Inject(CloudinaryService) private cloudinaryService: CloudinaryService,
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(GenerateService) private generate: GenerateService,
  ) {}

  async uploadUserAvatar(image?: Express.Multer.File) {
    if (!image)
      throw new BadRequestException(httpErrorMessages.IMAGE_FIELD_IS_EMPTY)

    const imageUrl = await this.cloudinaryService.uploadImage(image, 'avatars')

    return { imageUrl }
  }

  async uploadBannerImage(
    body: UploadBannerImageDto,
    image: Express.Multer.File,
  ) {
    const { bannerId } = body

    const banner = await this.prisma.banner.findUnique({
      where: { id: bannerId },
      include: { image: true },
    })

    if (!banner)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Banner'))

    const { url, publicId } = await this.cloudinaryService.uploadImage(
      image,
      'banners',
    )

    try {
      await this.prisma.$transaction(async (tx) => {
        if (banner.image) {
          await tx.deletedQueue.create({
            data: {
              itemId: banner.image.id,
              fileId: banner.image.imageId,
              type: 'banner',
            },
          })

          await tx.bannerImage.delete({ where: { id: banner.image.id } })
        }

        await tx.bannerImage.create({
          data: {
            imageUrl: url,
            imageId: publicId,
            encoding: image.encoding,
            fileSize: image.size,
            mimeType: image.mimetype,
            originalName: image.originalname,
            bannerId: banner.id,
          },
        })
      })

      return { message: httpSuccessMessages.UPLOADED('Banner image') }
    } catch {
      await this.cloudinaryService.deleteImage(publicId)
      throw new InternalServerErrorException(httpErrorMessages.SERVER_ERROR)
    }
  }

  async uploadCategoryIcon(
    image: Express.Multer.File,
    body: UploadCategoryIconDto,
  ) {
    const { categoryId } = body
    const { mimetype, originalname, size, encoding } = image

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { icon: true },
    })

    if (!category) throw new NotFoundException(httpErrorMessages.NOT_FOUND)

    const { publicId, url } = await this.cloudinaryService.uploadImage(
      image,
      'icons',
    )

    try {
      await this.prisma.$transaction(async (tx) => {
        if (category.icon) {
          await tx.deletedQueue.create({
            data: {
              itemId: category.icon.id,
              fileId: category.icon.imageId,
              type: 'category',
            },
          })

          await tx.categoryIcon.delete({ where: { id: category.icon.id } })
        }

        await tx.categoryIcon.create({
          data: {
            imageUrl: url,
            imageId: publicId,
            encoding: encoding,
            fileSize: size,
            mimeType: mimetype,
            originalName: originalname,
            categoryId: category.id,
          },
        })
      })

      return { message: httpSuccessMessages.UPLOADED('Category icon') }
    } catch {
      await this.cloudinaryService.deleteImage(publicId)
      throw new InternalServerErrorException(httpErrorMessages.SERVER_ERROR)
    }
  }

  async uploadProductImage(
    query: UploadProductImageDto,
    images?: Express.Multer.File[],
  ) {
    if (!images?.length)
      throw new BadRequestException(httpErrorMessages.IMAGE_FIELD_IS_EMPTY)

    const { productId } = query

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product)
      throw new NotFoundException(
        httpErrorMessages.NOT_FOUND('Products by this id'),
      )

    const lastPosition = await this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { position: 'desc' },
      take: 1,
    })

    const startPosition = lastPosition[0]?.position ?? -1

    const uploadedImages = await Promise.all(
      images.map(async (image, index) => {
        const { url, publicId } = await this.cloudinaryService.uploadImage(
          image,
          'images',
        )

        return {
          imageUrl: url,
          imageId: publicId,
          encoding: image.encoding,
          fileSize: image.size,
          mimeType: image.mimetype,
          originalName: image.originalname,
          productId,
          fileName: image.filename,
          position: startPosition + 1 + index,
        }
      }),
    )

    const savedImages = await this.prisma.productImage.createMany({
      data: uploadedImages,
    })

    return {
      message: httpSuccessMessages.UPLOADED('Product images'),
      savedImages,
    }
  }

  async deleteBannerImageById(param: DeleteBannerImageByIdDto) {
    const { bannerImageId } = param

    const bannerImage = await this.prisma.bannerImage.findUnique({
      where: {
        id: bannerImageId,
      },
    })

    if (!bannerImage)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Banner image'))

    await this.prisma.$transaction([
      this.prisma.bannerImage.delete({
        where: { id: bannerImageId },
      }),

      this.prisma.deletedQueue.create({
        data: {
          itemId: bannerImage.id,
          fileId: bannerImage.imageId,
          type: 'bannerImage',
        },
      }),
    ])

    return { message: httpSuccessMessages.DELETED('Banner image') }
  }

  async deleteProductImageById(param: DeleteProductImageByIdDto) {
    const { productId, productImageId } = param

    const image = await this.prisma.productImage.findFirst({
      where: {
        productId: productId,
        id: productImageId,
      },
    })

    if (!image)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Product image'))

    await this.prisma.$transaction([
      this.prisma.productImage.delete({
        where: { id: image.id },
      }),
      this.prisma.deletedQueue.create({
        data: {
          itemId: image.id,
          fileId: image.imageId,
          type: 'productImage',
        },
      }),
    ])

    return { message: httpSuccessMessages.DELETED('Product image') }
  }

  async setMainProductImage(param: SetMainProductImageDto) {
    const { productId, productImageId } = param

    const target = await this.prisma.productImage.findFirst({
      where: { productId, id: productImageId },
    })

    if (!target)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Product image'))

    if (target.position === 0) {
      return { message: httpSuccessMessages.UPDATED('Product image') }
    }

    const currentMain = await this.prisma.productImage.findFirst({
      where: { productId, position: 0 },
    })

    const tmpPosition = -1

    await this.prisma.$transaction(async (tx) => {
      if (currentMain) {
        await tx.productImage.update({
          where: { id: currentMain.id },
          data: { position: tmpPosition },
        })
      }

      await tx.productImage.update({
        where: { id: target.id },
        data: { position: 0 },
      })

      if (currentMain) {
        await tx.productImage.update({
          where: { id: currentMain.id },
          data: { position: target.position },
        })
      }
    })

    return { message: httpSuccessMessages.UPDATED('Product image') }
  }
}

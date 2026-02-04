import { httpErrorMessages } from '@/common/constants/http.messages.constnats'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service'
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import axios from 'axios'
import { Response } from 'express'
import { GetProductImageBySlug } from './dto/getProductImageBySlug.dto'

@Injectable()
export class StorageService {
  private logger = new Logger(StorageService.name)

  constructor(
    @Inject(CloudinaryService)
    private cloudinaryService: CloudinaryService,
    @Inject(PrismaService) private prisma: PrismaService,
  ) {}

  private async sendImage(res: Response, imageUrl: string) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'stream',
      })

      res.setHeader(
        'Content-Type',
        response.headers['content-type'] || 'image/jpeg',
      )
      res.setHeader('Cache-Control', 'public, max-age=86400')

      response.data.pipe(res)
    } catch (e) {
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Image'))
    }
  }

  async getCategoryIconBySlug(
    categorySlug: string,

    res: Response,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { icon: true },
    })

    if (!category?.icon)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Category'))

    await this.sendImage(res, category.icon.imageUrl)
  }

  async getProductImageBySlug(param: GetProductImageBySlug, res: Response) {
    const { productSlug, position } = param

    const image = await this.prisma.productImage.findFirst({
      where: {
        position,
        product: {
          slug: productSlug,
        },
      },
    })

    if (!image)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Product image'))

    await this.sendImage(res, image.imageUrl)
  }

  async getBannerImageBySlug(bannerSlug: string, res: Response) {
    const banner = await this.prisma.banner.findUnique({
      where: { bannerSlug },
      include: { image: true },
    })

    if (!banner?.image)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Banner'))

    await this.sendImage(res, banner.image?.imageUrl)
  }
}

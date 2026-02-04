import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { GenerateService } from '@/common/tools/generate/generate.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateBannerDto } from '../dto/createBanner.dto'
import { DeleteBannerDto } from '../dto/deleteBanner.dto'
import { UpdateBannerDto } from '../dto/updateBanner.dto'

@Injectable()
export class PrivateBannerService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(GenerateService) private generate: GenerateService,
  ) {}

  async createBanner(body: CreateBannerDto) {
    const { contentPosition, openUrl, description, title, buttonTitle } = body

    const bannerSlug = await this.generate.bannerSlug(title)

    const maxPosition = await this.prisma.banner.aggregate({
      _max: { position: true },
    })

    const nextPosition = (maxPosition._max.position ?? -1) + 1

    await this.prisma.banner.create({
      data: {
        bannerSlug,
        openUrl,
        position: nextPosition,
        contentPosition,
        description,
        title,
        buttonTitle,
      },
    })

    return { message: httpSuccessMessages.CREATED('Banner') }
  }

  async updateBanner(body: UpdateBannerDto) {
    const {
      description,
      title,
      bannerId,
      buttonTitle,
      openUrl,
      contentPosition,
    } = body

    await this.prisma.banner.update({
      where: { id: bannerId },
      data: { title, description, buttonTitle, openUrl, contentPosition },
    })

    return { message: httpSuccessMessages.UPDATED('Banner') }
  }

  async deleteBannerById(param: DeleteBannerDto) {
    const { bannerId } = param

    return await this.prisma.$transaction(async (tx) => {
      const banner = await tx.banner.findUnique({
        where: { id: bannerId },
        include: { image: true },
      })

      if (!banner)
        throw new NotFoundException(httpErrorMessages.NOT_FOUND('Banner'))

      await tx.deletedQueue.create({
        data: {
          type: 'banner',
          fileId: banner.image?.imageId || '',
          itemId: banner.image?.id || '',
        },
      })
      await tx.banner.delete({ where: { id: bannerId } })

      return { message: httpSuccessMessages.DELETED('Banner') }
    })
  }
}

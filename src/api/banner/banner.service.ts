import { httpErrorMessages } from '@/common/constants/http.messages.constnats'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GetBannerAllDto } from './dto/getBannerAll.dto'
import { getBannersSelectQuery } from './queries/banner.select.queries'

@Injectable()
export class BannerService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getBanners(query: GetBannerAllDto) {
    const { limit } = query

    const banners = await this.prisma.banner.findMany({
      select: getBannersSelectQuery(),
      take: limit,
    })

    if (!banners.length)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Banners'))

    return banners
  }
}

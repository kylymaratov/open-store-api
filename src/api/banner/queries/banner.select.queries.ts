import { Prisma } from '@prisma/client'

export const getBannersSelectQuery = (): Prisma.BannerSelect => ({
  id: true,
  openUrl: true,
  position: true,
  description: true,
  title: true,
  buttonTitle: true,
  contentPosition: true,
  bannerSlug: true,
  image: true,
})

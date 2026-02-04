import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable } from '@nestjs/common'
import slugify from 'slugify'

@Injectable()
export class GenerateService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  time(format: string = 'ru-RU', timeZone: string = 'Asia/Bishkek') {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'timeZone',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date())
  }

  private async generateUniqueSlug(
    model: any,
    name: string,
    fieldName: string = 'slug',
  ) {
    const baseSlug = slugify(name, { lower: true, strict: true })

    const existing = await model.findMany({
      where: {
        [fieldName]: {
          startsWith: baseSlug,
        },
      },
      select: { [fieldName]: true },
    })

    if (existing.length === 0) return baseSlug

    const regex = new RegExp(`^${baseSlug}(?:-(\\d+))?$`)

    let maxNumber = 0
    let foundBase = false

    existing.forEach((item: any) => {
      const val = item[fieldName]
      const match = val.match(regex)

      if (match) {
        if (match[1] === undefined) {
          foundBase = true
        } else {
          const num = parseInt(match[1], 10)
          if (num > maxNumber) maxNumber = num
        }
      }
    })

    if (!foundBase && !existing.some((e: any) => e[fieldName] === baseSlug)) {
      return baseSlug
    }

    return `${baseSlug}-${maxNumber + 1}`
  }

  async bannerSlug(name?: string) {
    const { nanoid } = await import('nanoid')
    const suffix = nanoid(5)

    if (!name) return `banner-${suffix}`

    const slug = slugify(name, { lower: true, strict: true })

    return `banner-${slug}-${suffix}`
  }

  async categorySlug(name: string) {
    return await this.generateUniqueSlug(this.prisma.category, name, 'slug')
  }

  async productSlug(name: string) {
    return await this.generateUniqueSlug(this.prisma.product, name, 'slug')
  }

  sku(name: string): string {
    const prefix = name
      .replace(/[^A-Z0-9]/gi, '')
      .substring(0, 3)
      .toUpperCase()
    const randomPart = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomPart}`
  }
}

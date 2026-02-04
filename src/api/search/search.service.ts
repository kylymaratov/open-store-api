import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { SorterService } from '@/common/tools/sorter/sorter.service'
import { SearchProductsByNameDto } from './dto/searchProductsByName.dto'
import { getProductsSelectQuery } from '@/api/product/queries/product.select.queries'

@Injectable()
export class SearchService {
  private logger = new Logger(SearchService.name)

  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(SorterService) private sorter: SorterService,
  ) {}

  async searchProduct(query: SearchProductsByNameDto) {
    const {
      q,
      page = 1,
      limit = 12,
      withImage = true,
      sort,
      inStock,
      discountPercent,
      categorySlug,
    } = query

    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 12))
    const skip = (safePage - 1) * safeLimit

    const where: any = {
      OR: [
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ],
    }

    if (inStock !== undefined) {
      where.inStock = inStock
    }

    if (typeof discountPercent === 'number' && discountPercent > 0 && discountPercent < 99) {
      where.discountPercent = { gte: discountPercent }
    }

    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    const orderBy = this.sorter.sortProductBy(sort)

    const [products, totalProducts] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        take: safeLimit,
        skip: skip > 0 ? skip : undefined,
        orderBy,
        select: getProductsSelectQuery(withImage),
      }),
      this.prisma.product.count({ where }),
    ])

    return {
      products,
      currentPage: safePage,
      totalPages: Math.ceil(totalProducts / safeLimit) || 1,
      totalItems: totalProducts,
    }
  }
}

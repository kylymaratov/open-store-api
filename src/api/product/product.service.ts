import { TSession } from '@/@types/shared/session.types'
import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { PRODUCT_VIEW_LOCK_TIME_MS } from '@/common/constants/time.constants'
import { CacherService } from '@/common/tools/cacher/cacher.service'
import { SorterService } from '@/common/tools/sorter/sorter.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GetProductBySlugDto } from './dto/getProductBySlug.dto'
import { GetProductDescriptionDto } from './dto/getProductDescription.dto'
import { GetProductsDto } from './dto/getProducts.dto'
import { GetProductsByCategoryDto } from './dto/getProductsByCategory.dto'
import { GetSameProductsDto } from './dto/getSameProducts.dto'
import { IncProductViewDto } from './dto/incProductView.dto'
import {
  getProductBySlugSelectQuery,
  getProductsByCategorySelectQuery,
  getProductsSelectQuery,
  getSameProductSelectQuery,
} from './queries/product.select.queries'

@Injectable()
export class ProductService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(SorterService) private sorter: SorterService,
    @Inject(CacherService) private cacher: CacherService,
  ) {}

  async getProductCounts() {
    const counts = await this.prisma.product.groupBy({
      by: ['archived'],
      _count: true,
    })

    let totalCount = 0
    let archived = 0
    let active = 0

    counts.forEach((c) => {
      totalCount += c._count
      if (c.archived) archived = c._count
      else active = c._count
    })

    return { totalCount, archived, active }
  }

  async getSameProducts(query: GetSameProductsDto) {
    const { productSlug, limit = 10, withImage = true } = query

    const product = await this.prisma.product.findUnique({
      where: { slug: productSlug },
      include: {
        category: { select: { name: true } },
      },
    })

    if (!product) throw new NotFoundException(httpErrorMessages.NOT_FOUND)

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        slug: { not: productSlug },
      },
      select: getSameProductSelectQuery(withImage),
      take: limit,
    })

    if (!products.length)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Products'))

    return products
  }

  async getProducts(query: GetProductsDto) {
    const {
      page = 1,
      limit = 10,
      withImage = true,
      sort,
      inStock,
      discountPercent,
    } = query

    const where: any = {}

    const skip = (page - 1) * limit
    const orderBy = this.sorter.sortProductBy(sort)

    if (inStock !== undefined) {
      where.inStock = inStock
    }

    if (discountPercent > 0 && discountPercent < 99) {
      where.discountPercent = { gte: discountPercent }
    }

    const products = await this.prisma.product.findMany({
      where,
      take: limit,
      skip: skip > 0 ? skip : undefined,
      orderBy: orderBy,
      select: getProductsSelectQuery(withImage),
    })

    const totalProducts = await this.prisma.product.count()

    return {
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
    }
  }

  async getProductsByCategory(query: GetProductsByCategoryDto) {
    const { limit = 10, categorySlug, page = 1, sort, inStock } = query

    const where: any = {}

    const orderBy = this.sorter.sortProductBy(sort)

    if (inStock !== undefined) {
      where.inStock = inStock
    }

    const skip = (page - 1) * limit

    const products = await this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },
      take: limit,
      skip: skip > 0 ? skip : undefined,
      orderBy,
      select: getProductsByCategorySelectQuery(),
    })

    const totalProducts = await this.prisma.product.count({
      where: { category: { slug: categorySlug } },
    })

    if (!products.length)
      throw new NotFoundException(
        httpErrorMessages.NOT_FOUND('Prodcuts in this category'),
      )

    return {
      categorySlug,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
    }
  }

  async getProductBySlug(param: GetProductBySlugDto) {
    const { productSlug } = param

    const product = await this.prisma.product.findUnique({
      where: { slug: productSlug },
      select: getProductBySlugSelectQuery(),
    })

    if (!product)
      throw new NotFoundException(
        httpErrorMessages.NOT_FOUND('Product by this slug'),
      )

    return product
  }

  async getProductDescription(param: GetProductDescriptionDto) {
    const { productSlug } = param

    const productDescriptions = await this.prisma.productDescription.findMany({
      where: { product: { slug: productSlug } },
    })

    if (!productDescriptions.length)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND)

    return productDescriptions
  }

  async incProductView(query: IncProductViewDto, session: TSession) {
    const { productSlug } = query
    const lockKey = `lock:productView:${productSlug}:${session.sessionId}`

    const lock = await this.cacher.lock(lockKey, PRODUCT_VIEW_LOCK_TIME_MS)

    if (!lock) return

    try {
      await this.prisma.product.update({
        where: { slug: productSlug },
        data: { viewsCount: { increment: 1 } },
      })
    } finally {
      await this.cacher.release(lock)
    }

    return { message: httpSuccessMessages.UPDATED('Product view count') }
  }
}

import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { CacherService } from '@/common/tools/cacher/cacher.service'
import { GenerateService } from '@/common/tools/generate/generate.service'
import { HelperService } from '@/common/tools/helper/helper.service'
import { SorterService } from '@/common/tools/sorter/sorter.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CreateProductDto } from '../dto/createProduct.dto'
import { CreateProductDescriptionDto } from '../dto/createProductDescription.dto'
import { CreateProductSpecsDataDto } from '../dto/createProductSpecs.dto'
import { DeleteProductByIdDto } from '../dto/deleteProductById.dto'
import { GetProductByIdDto } from '../dto/getProductById.dto'
import { UpdateProductDtoById } from '../dto/updateProductById.dto'
import { UpdateProductDescriptionDto } from '../dto/updateProductDescription.dto'
import { UpdateProductSpecsDto } from '../dto/updateProductSpecs.dto'
import { getProductBySlugSelectQuery } from '../queries/product.select.queries'

@Injectable()
export class PrivateProductService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(GenerateService) private generate: GenerateService,
    @Inject(SorterService) private sorter: SorterService,
    @Inject(CacherService) private cacher: CacherService,
    @Inject(HelperService) private helper: HelperService,
  ) {}

  async getProductById(param: GetProductByIdDto) {
    const { productId } = param

    return await this.prisma.product.findUnique({
      where: { id: productId },
      select: getProductBySlugSelectQuery(),
    })
  }

  async createProduct(body: CreateProductDto) {
    const { categoryId, name, inStock, price, discountedPrice } = body

    const existsCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!existsCategory)
      throw new BadRequestException(
        httpErrorMessages.NOT_FOUND('Category by this id'),
      )

    let discountPercent: number | null = null

    if (discountedPrice && discountedPrice >= price)
      throw new ConflictException(
        httpErrorMessages.DISCOUNT_PRICE_CANNOT_BE_BIGGER,
      )

    if (discountedPrice) {
      discountPercent = ((price - discountedPrice) / price) * 100
    }

    const productSlug = await this.generate.productSlug(name)

    const savedProduct = await this.prisma.product.create({
      data: {
        name,
        categoryId,
        inStock,
        price,
        soldCount: 0,
        discountedPrice,
        discountPercent,
        sku: this.generate.sku(productSlug),
        slug: productSlug,
      },
    })

    return {
      message: httpSuccessMessages.CREATED('Product'),
      productId: savedProduct.id,
    }
  }

  async createProductDescription(body: CreateProductDescriptionDto) {
    const { productId } = body

    const product =
      (await this.prisma.product.count({
        where: { id: productId },
      })) > 0

    if (!product) throw new NotFoundException(httpErrorMessages.NOT_FOUND)

    const { position, content, type } = body

    const extPosition = await this.prisma.productDescription.count({
      where: { productId, position },
    })

    if (extPosition)
      throw new ConflictException(httpErrorMessages.ALREADY_EXISTS)

    if (!content?.length)
      throw new BadRequestException(httpErrorMessages.INVALID_INPUT_DATA)

    if (type === 'image' || type === 'video') {
      if (!this.helper.isValidUrl(content))
        throw new BadRequestException(httpErrorMessages.INVALID_INPUT_DATA)
    }

    const description = await this.prisma.productDescription.create({
      data: {
        position,
        content,
        type,
        productId,
      },
    })

    return {
      message: httpSuccessMessages.CREATED('Product description'),
      productDescriptionId: description.id,
    }
  }

  async updateProductById(body: UpdateProductDtoById) {
    const { productId, data } = body
    const { discountedPrice, price } = data

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) throw new NotFoundException(httpErrorMessages.NOT_FOUND)

    let discountPercent: number | null = null

    if (discountedPrice && discountedPrice >= price)
      throw new ConflictException(
        httpErrorMessages.DISCOUNT_PRICE_CANNOT_BE_BIGGER,
      )

    if (discountedPrice) {
      discountPercent = ((price - discountedPrice) / price) * 100
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { ...data, discountPercent },
    })

    return { message: httpSuccessMessages.UPDATED('Product') }
  }

  async updateProductDescription(body: UpdateProductDescriptionDto) {
    const { productId, descriptionId } = body

    let updateOptions = {}

    const productDescription = await this.prisma.productDescription.findUnique({
      where: { productId, id: descriptionId },
    })

    if (!productDescription)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND)

    let { position, content, type } = body

    if (!content?.length)
      throw new BadRequestException(httpErrorMessages.INVALID_INPUT_DATA)

    if (type) {
      if (type === 'image' && !this.helper.isValidUrl(content)) {
        throw new BadRequestException(httpErrorMessages.INVALID_INPUT_DATA)
      }

      updateOptions = { ...updateOptions, type }
    }

    if (position) {
      updateOptions = { ...updateOptions, position }
    }

    updateOptions = { ...updateOptions, content }

    await this.prisma.productDescription.update({
      where: { productId, id: descriptionId },
      data: updateOptions,
    })

    return { message: httpSuccessMessages.UPDATED('Product description') }
  }

  async deleteProductById(param: DeleteProductByIdDto) {
    const { productId } = param

    return await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { images: true },
      })

      if (!product)
        throw new NotFoundException(httpErrorMessages.NOT_FOUND('Product'))

      await tx.deletedQueue.createMany({
        data: product.images.map((img) => ({
          type: 'product',
          fileId: img.imageId,
          itemId: String(productId),
        })),
      })

      await tx.product.delete({ where: { id: productId } })

      return { message: httpSuccessMessages.DELETED('Product') }
    })
  }

  async createProductSpecs(body: CreateProductSpecsDataDto) {
    const { productId, groups } = body

    const productSpecs = await this.prisma.productSpecs.findUnique({
      where: { productId },
    })

    if (productSpecs)
      throw new ConflictException(
        httpErrorMessages.ALREADY_EXISTS('Product specs'),
      )

    await this.prisma.productSpecs.create({
      data: {
        productId,
        content: { groups } as unknown as Prisma.InputJsonValue,
      },
    })

    return { message: httpSuccessMessages.CREATED('Product specs') }
  }

  async updateProductSpecs(body: UpdateProductSpecsDto) {
    const { productId, groups } = body

    await this.prisma.productSpecs.upsert({
      where: { productId },
      update: {
        content: { groups } as unknown as Prisma.InputJsonValue,
      },
      create: {
        productId,
        content: { groups } as unknown as Prisma.InputJsonValue,
      },
    })

    return { message: httpSuccessMessages.UPDATED('Product specs') }
  }
}

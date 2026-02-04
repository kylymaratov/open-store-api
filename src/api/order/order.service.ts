import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { GenerateService } from '@/common/tools/generate/generate.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateOrderDTo, OrderDeliveryType } from './dto/createOrder.dto'
import { GetOrdersDto } from './dto/getOrders.dto'

@Injectable()
export class OrderService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(GenerateService) private generate: GenerateService,
  ) {}

  async createOrder(body: CreateOrderDTo) {
    const {
      comment,
      deliveryAddress,
      deliveryType,
      firstName,
      phoneNumber,
      products,
      email,
      lastName,
    } = body

    const skus = products.map((p) => p.sku)

    const extProducts = await this.prisma.product.findMany({
      where: {
        sku: { in: skus },
        inStock: true,
      },
    })

    if (extProducts.length !== products.length)
      throw new BadRequestException(httpErrorMessages.SOME_PRODUCT_NOT_FOUND)

    const countMap = Object.fromEntries(products.map((p) => [p.sku, p.count]))

    const { totalPrice, totalDiscount } = extProducts.reduce(
      (acc, p) => {
        const count = countMap[p.sku] || 1

        if (p.discountedPrice) {
          acc.totalPrice += p.discountedPrice * count
          acc.totalDiscount += (p.price - p.discountedPrice) * count
        } else {
          acc.totalPrice += p.price * count
        }

        return acc
      },
      { totalPrice: 0, totalDiscount: 0 },
    )

    const registerTime = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Asia/Bishkek',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date())

    const order = await this.prisma.order.create({
      data: {
        deliveryAddress:
          deliveryType === OrderDeliveryType.DELIVERY ? deliveryAddress : '',
        firstName,
        phoneNumber,
        email,
        lastName,
        products: JSON.stringify(products),
        comment,
        totalPrice,
        totalDiscount,
        registerTime,
        deliveryType,
      },
    })

    return { message: httpSuccessMessages.CREATED('Order') }
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { orderId } })

    if (!order)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Order by id'))

    return order
  }

  async getOrders(query: GetOrdersDto) {
    const { q, page = 1, limit = 30 } = query

    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 30))
    const skip = (safePage - 1) * safeLimit

    const trimmed = typeof q === 'string' ? q.trim() : ''

    const where: any = trimmed
      ? {
          OR: [
            { orderId: { contains: trimmed, mode: 'insensitive' } },
            { phoneNumber: { contains: trimmed, mode: 'insensitive' } },
            { firstName: { contains: trimmed, mode: 'insensitive' } },
            { lastName: { contains: trimmed, mode: 'insensitive' } },
            { email: { contains: trimmed, mode: 'insensitive' } },
          ],
        }
      : {}

    const [orders, totalOrders] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        take: safeLimit,
        skip: skip > 0 ? skip : undefined,
        orderBy: { registerTime: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ])

    return {
      orders,
      currentPage: safePage,
      totalPages: Math.ceil(totalOrders / safeLimit) || 1,
      totalItems: totalOrders,
    }
  }
}

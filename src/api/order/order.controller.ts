import { AdminGuard } from '@/common/guards/admin.guard'
import { SessionGuard } from '@/common/guards/session.guard'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CreateOrderDTo } from './dto/createOrder.dto'
import { GetOrdersDto } from './dto/getOrders.dto'
import { OrderService } from './order.service'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(SessionGuard)
  @Post('create-order')
  createOrder(@Body() body: CreateOrderDTo) {
    return this.orderService.createOrder(body)
  }

  @UseGuards(AdminGuard)
  @Get('orders')
  getOrders(@Query() query: GetOrdersDto) {
    return this.orderService.getOrders(query)
  }

  @UseGuards(AdminGuard)
  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId)
  }
}

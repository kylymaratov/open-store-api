import { HelperService } from '@/common/tools/helper/helper.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { TelegramBotService } from '@/modules/telegram-bot/telegrambot.service.'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class BotWorker {
  private logger = new Logger(BotWorker.name)

  constructor(
    @Inject(TelegramBotService)
    private telegramBot: TelegramBotService,
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(HelperService) private helper: HelperService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async publishOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        where: { published: false },
        orderBy: {
          createdAt: 'asc',
        },
      })

      for (const order of orders) {
        try {
          await this.telegramBot.sendOrder(order)
          await this.prisma.order.update({
            where: { orderId: order.orderId },
            data: { published: true },
          })
          await this.helper.sleep(5000)
        } catch (error) {
          this.logger.log(`Error send order to telegram: ${error.message}`)
        }
      }
    } catch (error) {
      this.logger.log(`Error get orders: ${error.message}`)
    }
  }
}

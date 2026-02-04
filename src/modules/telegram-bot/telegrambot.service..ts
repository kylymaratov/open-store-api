import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Order } from '@prisma/client'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

@Injectable()
export class TelegramBotService {
  private getUrl = (token: string) => `https://api.telegram.org/bot${token}`

  constructor(@Inject(ConfigService) private config: ConfigService) {}

  async sendOrder(order: Order) {
    try {
      const token = this.config.get<string>('TELEGRAM_BOT_TOKEN') as string
      const chatid = this.config.get<string>('TELEGRAM_CHAT_ID') as string
      const domain = this.config.get<string>('DOMAIN') as string

      const commnet = order.comment ? `\n\nКоментарий:\n${order.comment}` : ''

      await axios.post(this.getUrl(token) + '/sendMessage', {
        chat_id: chatid,
        text: `*Новый заказ*\nID: ${order.orderId}\nИмя: ${order.firstName}\nФамилия: ${order.lastName}\nНомер: ${order.phoneNumber}\nСумма заказа на ${order.totalPrice} сом${commnet}\n\n_Дата ${order.registerTime}_ #order`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Открыть заказ',
                url: `${domain}/orders/${order.orderId}`,
              },
            ],
          ],
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  async sendDatabaseBackup(filePath: string) {
    try {
      const token = this.config.get<string>('TELEGRAM_BOT_TOKEN') as string
      const chatId = this.config.get<string>('TELEGRAM_CHAT_ID') as string

      const formData = new FormData()
      formData.append('chat_id', chatId)
      formData.append('document', fs.createReadStream(filePath))
      formData.append(
        'caption',
        `📅 Database backup from ${new Date().toLocaleString()}\n\n#backup`,
      )

      await axios.post(this.getUrl(token) + '/sendDocument', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      })
    } catch (error) {
      throw error
    }
  }
}

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TelegramBotService } from './telegrambot.service.'

@Module({
  providers: [TelegramBotService, ConfigService],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}

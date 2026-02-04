import { HelperModule } from '@/common/tools/helper/helper.module'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TelegramBotModule } from '../telegram-bot/telegrambot.module'
import { BackupWorker } from './workers/backup.worker'
import { StorageWorker } from './workers/storage.worker'
import { BotWorker } from './workers/telegrambot.worker'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HelperModule,
    TelegramBotModule,
    CloudinaryModule,
  ],
  providers: [BotWorker, StorageWorker, BackupWorker, PrismaService],
})
export class WrokerModule {}

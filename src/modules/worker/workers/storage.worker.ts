import { PrismaService } from '@/databases/prisma/prisma.service'
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class StorageWorker {
  private logger = new Logger(StorageWorker.name)
  private isProcessing = false

  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(CloudinaryService) private cloudinary: CloudinaryService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async deleteD3Item() {
    if (this.isProcessing) return

    this.isProcessing = true

    try {
      const items = await this.prisma.deletedQueue.findMany({
        take: 50,
        where: { attemps: { lt: 5 } },
      })

      for (const item of items) {
        try {
          if (!item.fileId) {
            await this.prisma.deletedQueue.delete({ where: { id: item.id } })
            continue
          }

          await this.cloudinary.deleteImage(item.fileId)
          await this.prisma.deletedQueue.delete({ where: { id: item.id } })
        } catch {
          await this.prisma.deletedQueue.update({
            where: { id: item.id },
            data: { attemps: { increment: 1 } },
          })
          this.logger.error(
            `Error while delete ${item.fileId}. Try count ${item.attemps + 1}`,
          )
        }
      }
    } catch (error) {
    } finally {
      this.isProcessing = false
    }
  }
}

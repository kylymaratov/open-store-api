import { TelegramBotService } from '@/modules/telegram-bot/telegrambot.service.'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

const execPromise = promisify(exec)

@Injectable()
export class BackupWorker {
  private logger = new Logger(BackupWorker.name)

  private backupDir = path.join(process.cwd(), 'backups')

  constructor(
    @Inject(TelegramBotService) private telegramBot: TelegramBotService,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    this.createBackupDir()
  }

  private async createBackupDir() {
    try {
      await fs.access(this.backupDir)
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true })
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const sqlFileName = `backup-${timestamp}.sql`
    const zipFileName = `backup-${timestamp}.7z`
    const sqlPath = path.join(this.backupDir, sqlFileName)
    const zipPath = path.join(this.backupDir, zipFileName)

    try {
      const dbUrl = this.config.get<string>('DATABASE_URL')
      const dBbackupZipKey = this.config.get<string>('DB_BACKUP_ZIP_KEY')

      await execPromise(`pg_dump ${dbUrl} > ${sqlPath}`)

      await execPromise(
        `7z a "${zipPath}" "${sqlPath}" -p"${dBbackupZipKey}" -mhe=on -t7z`,
      )

      await fs.unlink(sqlPath)

      await this.telegramBot.sendDatabaseBackup(zipPath)

      this.logger.log(`${zipFileName} backup successfilly pushed to telegram`)

      await fs.unlink(zipPath)
    } catch (error) {
      this.logger.error(error)
      await fs.unlink(sqlPath)
      await fs.unlink(zipPath)
    }
  }
}

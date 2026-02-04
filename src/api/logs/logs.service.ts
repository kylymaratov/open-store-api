import { Injectable, InternalServerErrorException } from '@nestjs/common'
import fs from 'fs/promises'
import path from 'path'
import { ReadLogsDto } from './dto/readLogs.dto'

@Injectable()
export class LogsService {
  private logsPath = path.join('../../../', 'logs')

  async readLogs(query: ReadLogsDto) {
    const { level } = query

    try {
      const data = await fs.readFile(
        this.logsPath + `/api-${level}.log`,
        'utf-8',
      )

      return data
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}

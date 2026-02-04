import { AdminGuard } from '@/common/guards/admin.guard'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ReadLogsDto } from './dto/readLogs.dto'
import { LogsService } from './logs.service'

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @UseGuards(AdminGuard)
  @Get('read')
  readLogs(@Query() query: ReadLogsDto) {
    return this.logsService.readLogs(query)
  }
}

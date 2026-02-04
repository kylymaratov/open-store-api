import { IsEnum } from 'class-validator'

export class ReadLogsDto {
  @IsEnum(['error', 'success'])
  level: 'error' | 'success'
}

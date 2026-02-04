import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class GetOrdersDto {
  @IsOptional()
  q?: string

  @IsOptional()
  @Transform(({ value }) => Number(value) || undefined)
  page?: number

  @IsOptional()
  @Transform(({ value }) => Number(value) || undefined)
  limit?: number
}

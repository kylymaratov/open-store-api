import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class GetBannerAllDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number
}

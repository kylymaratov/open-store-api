import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class GetSameProductsDto {
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  productSlug: string

  @IsOptional()
  @Transform(({ value }) => Number(value) || undefined)
  limit?: number

  @IsOptional()
  @Transform(({ value }) => (String(value) === 'true' ? true : false))
  withImage?: boolean
}

import { TSortOption } from '@/@types/shared/sort.types'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class GetProductsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value) || undefined)
  page?: number

  @IsOptional()
  @Transform(({ value }) => Number(value) || undefined)
  limit?: number

  @IsOptional()
  @Transform(({ value }) => (String(value) === 'true' ? true : false))
  withImage?: boolean

  @IsOptional()
  sort?: TSortOption

  @IsOptional()
  @Transform(({ value }) => (String(value) === 'true' ? true : false))
  inStock?: boolean

  @IsOptional()
  @Transform(({ value }) => Number(value))
  discountPercent: number
}

import { TSortOption } from '@/@types/shared/sort.types'
import { Transform } from 'class-transformer'
import { IsByteLength, IsNotEmpty, IsOptional } from 'class-validator'

export class SearchProductsByNameDto {
  @IsNotEmpty()
  @IsByteLength(3, 1000)
  q: string

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
  discountPercent?: number

  @IsOptional()
  categorySlug?: string
}

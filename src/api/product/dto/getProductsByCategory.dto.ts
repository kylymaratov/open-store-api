import { TSortOption } from '@/@types/shared/sort.types'
import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator'

export class GetProductsByCategoryDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  limit?: number

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  page?: number

  @IsNotEmpty()
  categorySlug: string

  @IsOptional()
  sort?: TSortOption

  @IsOptional()
  @Transform(({ value }) => (String(value) === 'true' ? true : false))
  inStock?: boolean
}

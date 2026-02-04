import { TSortOption } from '@/@types/shared/sort.types'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'

export class GetCategoriesDto {
  @IsOptional()
  q?: string

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  limit?: number

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  page?: number

  @IsOptional()
  sort?: TSortOption
}

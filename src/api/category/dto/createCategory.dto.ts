import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string

  @IsOptional()
  description?: string

  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : Number(value)))
  @IsInt()
  parentId?: number | null
}

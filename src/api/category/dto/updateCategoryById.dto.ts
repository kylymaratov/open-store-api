import { Transform, Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

class UpdateDataDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return undefined
    if (value === 'null') return null
    if (value === 0 || value === '0') return null
    return Number(value)
  })
  @IsInt()
  parentId?: number | null
}

export class UpdateCategoryByIdDto {
  @IsNotEmpty({ message: 'CategoryId field is required' })
  @IsInt()
  @Transform(({ value }) => Number(value))
  categoryId: number

  @IsNotEmpty({ message: 'Edit data field is required' })
  @ValidateNested()
  @Type(() => UpdateDataDto)
  data: UpdateDataDto
}

import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateProductDescriptionDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  productId: number

  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  descriptionId: number

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  position?: number

  @IsNotEmpty()
  @IsString()
  content?: string

  @IsNotEmpty()
  @IsEnum(['text', 'image'])
  type: 'text' | 'image'
}

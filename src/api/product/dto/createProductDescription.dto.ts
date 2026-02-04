import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProductDescriptionDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  productId: number

  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  position: number

  @IsNotEmpty()
  @IsEnum(['text', 'image', 'video'])
  type: 'text' | 'image' | 'video'

  @IsOptional()
  @IsString()
  content?: string
}

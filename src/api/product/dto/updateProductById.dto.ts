import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator'

class UpdateDataDto {
  @IsNotEmpty()
  @Transform(
    ({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value),
    { toClassOnly: true },
  )
  categoryId: number

  @IsBoolean()
  @IsOptional()
  inStock: boolean

  @Transform(({ value }) => Number(value))
  price: number

  @IsOptional()
  @Transform(({ value }) => Number(value))
  discountedPrice?: number
}

export class UpdateProductDtoById {
  @IsNotEmpty({ message: 'Name field is required' })
  @Transform(({ value }) => Number(value))
  productId: number

  @IsNotEmpty({ message: 'Update data field is required' })
  @ValidateNested()
  @Type(() => UpdateDataDto)
  data: UpdateDataDto
}

import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateProductDto {
  @IsNotEmpty({ message: 'Name field is required' })
  name: string

  @IsNotEmpty()
  @Transform(
    ({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value),
    { toClassOnly: true },
  )
  categoryId: number

  @IsBoolean()
  @IsNotEmpty({ message: 'In stock field is required' })
  inStock: boolean

  @IsNotEmpty({ message: 'Price field is required' })
  @Transform(({ value }) => Number(value))
  price: number

  @IsOptional()
  @Transform(({ value }) => Number(value))
  discountedPrice?: number
}

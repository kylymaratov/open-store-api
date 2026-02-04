import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class GetProductByIdDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  productId: number
}

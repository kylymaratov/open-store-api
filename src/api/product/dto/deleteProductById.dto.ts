import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class DeleteProductByIdDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  productId: number
}

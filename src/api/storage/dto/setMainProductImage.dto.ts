import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class SetMainProductImageDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  productId: number

  @IsNotEmpty()
  productImageId: string
}

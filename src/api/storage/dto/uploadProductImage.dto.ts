import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class UploadProductImageDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  productId: number
}

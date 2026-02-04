import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class GetProductImageBySlug {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  position: number

  @IsNotEmpty()
  productSlug: string
}

import { IsNotEmpty } from 'class-validator'

export class GetProductDescriptionDto {
  @IsNotEmpty()
  productSlug: string
}

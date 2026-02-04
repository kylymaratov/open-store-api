import { IsNotEmpty } from 'class-validator'

export class GetProductBySlugDto {
  @IsNotEmpty()
  productSlug: string
}

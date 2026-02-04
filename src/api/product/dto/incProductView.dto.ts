import { IsNotEmpty } from 'class-validator'

export class IncProductViewDto {
  @IsNotEmpty()
  productSlug: string
}

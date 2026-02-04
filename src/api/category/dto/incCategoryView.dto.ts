import { IsNotEmpty } from 'class-validator'

export class IncCategoryViewDto {
  @IsNotEmpty()
  categorySlug: string
}

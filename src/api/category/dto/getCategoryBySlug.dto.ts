import { IsNotEmpty } from 'class-validator'

export class GetCategoryBySlugDto {
  @IsNotEmpty({ message: 'CategoryId field is required' })
  categorySlug: string
}

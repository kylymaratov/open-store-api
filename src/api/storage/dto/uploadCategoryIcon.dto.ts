import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class UploadCategoryIconDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  categoryId: number
}

import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class DeleteBannerDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  bannerId: number
}

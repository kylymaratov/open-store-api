import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateBannerDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  bannerId: number

  @IsOptional()
  buttonTitle?: string

  @IsOptional()
  title?: string

  @IsOptional()
  description?: string

  @IsOptional()
  openUrl?: string

  @IsOptional()
  @IsEnum(['left', 'right', 'center'])
  contentPosition?: 'left' | 'center' | 'right'
}

import { IsEnum, IsNotEmpty, IsOptional, IsUrl } from 'class-validator'

export class CreateBannerDto {
  @IsNotEmpty()
  @IsUrl()
  openUrl: string

  @IsOptional()
  title?: string

  @IsOptional()
  description?: string

  @IsNotEmpty()
  @IsEnum(['right', 'left', 'center'])
  contentPosition: 'right' | 'left' | 'center'

  @IsOptional()
  buttonTitle?: string
}

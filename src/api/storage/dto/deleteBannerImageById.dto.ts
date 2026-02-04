import { IsNotEmpty } from 'class-validator'

export class DeleteBannerImageByIdDto {
  @IsNotEmpty()
  bannerImageId: string
}

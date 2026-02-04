import { IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteAdminDto {
  @IsNotEmpty()
  @IsNumber()
  adminId: number
}

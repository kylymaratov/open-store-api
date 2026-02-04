import { TRole } from '@/@types/shared/role.types'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateAdminDto {
  @IsNotEmpty()
  @IsNumber()
  adminId: number

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsString()
  middleName?: string

  @IsOptional()
  @IsEnum(['admin', 'root'] as const)
  role?: TRole

  @IsOptional()
  @IsBoolean()
  verified?: boolean
}

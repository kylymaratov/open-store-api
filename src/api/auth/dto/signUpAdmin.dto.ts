import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class SignUpAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @IsByteLength(8, Infinity)
  password: string

  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  middleName: string

  @IsOptional()
  @IsByteLength(8, Infinity)
  retypePassword: string
}

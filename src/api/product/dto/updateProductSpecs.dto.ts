import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'

class ProductSpecItemDto {
  @IsString()
  @IsNotEmpty()
  key: string

  @IsString()
  @IsNotEmpty()
  label: string

  @IsNotEmpty()
  value: any
}

class ProductSpecGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecItemDto)
  items: ProductSpecItemDto[]
}

export class UpdateProductSpecsDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  productId: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecGroupDto)
  groups: ProductSpecGroupDto[]
}

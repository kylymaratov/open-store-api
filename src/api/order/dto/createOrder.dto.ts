import { Transform } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator'

class Products {
  @IsNotEmpty()
  sku: string

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  count: number
}

export enum OrderDeliveryType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
}

export class CreateOrderDTo {
  @IsNotEmpty()
  firstName: string

  @IsOptional()
  lastName?: string

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+996 \(\d{3}\) \d{2}-\d{2}-\d{2}$/, {})
  phoneNumber: string

  @IsOptional()
  email?: string

  @ValidateIf((o) => o.deliveryType === OrderDeliveryType.DELIVERY)
  @IsNotEmpty()
  deliveryAddress?: string

  @IsNotEmpty()
  @IsArray()
  products: Products[]

  @IsOptional()
  comment: string

  @IsNotEmpty()
  @IsEnum(OrderDeliveryType)
  deliveryType: OrderDeliveryType
}

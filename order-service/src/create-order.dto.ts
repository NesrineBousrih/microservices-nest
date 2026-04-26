import { IsNumber, IsPositive, IsEmail, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsEmail()
  customerEmail: string;
}
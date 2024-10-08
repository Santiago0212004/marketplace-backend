import { IsString, IsNumber, IsUrl, MinLength, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3, { message: 'Product name must be at least 3 characters long' })
  name: string;

  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  price: number;

  @IsUrl({}, { message: 'Main image URL must be a valid URL' })
  mainImageUrl: string;

  @IsString()
  subcategoryId: string;
}

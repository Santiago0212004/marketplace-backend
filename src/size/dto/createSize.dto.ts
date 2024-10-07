import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateSizeDto {
    @IsString()
    @MinLength(1, { message: 'Size name must be at least 1 characters long' })
    name: string;

    @IsUUID('4', { message: 'Product ID must be a valid UUID' })
    productId: string;
}
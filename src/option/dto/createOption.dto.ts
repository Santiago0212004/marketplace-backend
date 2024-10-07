import { IsString, IsUUID, IsUrl, MinLength } from 'class-validator';

export class CreateOptionDto {
    @IsString()
    @MinLength(3, { message: 'Description must be at least 3 characters long' })
    description: string;

    @IsUrl({}, { message: 'Main image URL must be a valid URL' })
    imageUrl: string;

    @IsUUID('4', { message: 'Product ID must be a valid UUID' })
    sizeId: string;
}
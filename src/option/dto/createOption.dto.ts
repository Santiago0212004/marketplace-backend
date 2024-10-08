import { IsString, IsUUID, IsUrl, MinLength } from 'class-validator';

export class CreateOptionDto {
    @IsString()
    @MinLength(3, { message: 'Description must be at least 3 characters long' })
    description: string;

    @IsUrl({}, { message: 'Main image URL must be a valid URL' })
    imageUrl: string;

    @IsString()
    sizeId: string;
}
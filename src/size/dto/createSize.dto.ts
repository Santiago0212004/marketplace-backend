import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateSizeDto {
    @IsString()
    @MinLength(1, { message: 'Size name must be at least 1 characters long' })
    name: string;

    @IsString()
    productId: string;
}
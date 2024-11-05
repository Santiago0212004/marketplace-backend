import { IsNumber, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateOptionDto {
  @IsString()
  @MinLength(3, { message: 'Description must be at least 3 characters long' })
  description: string;

  @IsUrl({}, { message: 'Main image URL must be a valid URL' })
  imageUrl: string;

  @IsNumber({}, { message: 'Available units must be a valid number' })
  availableUnits: number;
}
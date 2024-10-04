import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @MinLength(3, { message: 'Subcategory name must be at least 3 characters long' })
  name: string;

  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId: string;
}

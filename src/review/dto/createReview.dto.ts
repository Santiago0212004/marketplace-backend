import { IsString, IsNumber, IsUrl, MinLength, Min, Max, IsUUID} from 'class-validator';
export class CreateReviewDto {
   
    @IsNumber({}, { message: 'Rating must to be between 1 and 5' })
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @MinLength(3, { message: 'The comment to be at least 3 characters' })
    comment: string;

    @IsUUID('4', { message: 'Product or Seller ID must be a valid UUID' })
    id: string;
  }
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @Type(() => String)
    category?: string;

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    priceMin?: number;

    @IsOptional()
    @Type(() => Number)
    priceMax?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    qualification?: number;
}
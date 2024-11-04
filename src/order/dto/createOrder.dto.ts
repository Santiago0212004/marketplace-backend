import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    optionId: string;

    @IsNumber()
    amount: number;
}
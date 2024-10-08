import { IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    optionId: string;
}
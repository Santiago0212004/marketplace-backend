import { IsUUID } from 'class-validator';

export class CreateOrderDto {

    @IsUUID('4', { message: 'Option ID must be a valid UUID' })
    optionId: string;
}
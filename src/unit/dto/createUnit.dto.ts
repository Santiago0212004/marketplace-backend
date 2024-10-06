import { IsBoolean, IsUUID } from 'class-validator';

export class CreateUnitDto {
    @IsBoolean()
    sold: boolean;

    @IsUUID('4',{ message: 'Option ID must be a valid UUID' })
    optionId: string;
}


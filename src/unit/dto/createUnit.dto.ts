import { IsBoolean, IsUUID } from 'class-validator';

export class CreateUnitDto {
    @IsBoolean()
    sold: boolean;

    optionId: string;
}


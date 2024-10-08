import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateUnitDto {
    @IsBoolean()
    sold: boolean;

    @IsString()
    optionId: string;
}


import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entity/unit.entity';
import { CreateUnitDto } from './dto/createUnit.dto';
import { Option } from 'src/option/entity/option.entity';



@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(Unit)
        private readonly unitRepository: Repository<Unit>,

        @InjectRepository(Option)
        private readonly optionRepository: Repository<Option>,
    ) {}

    async create(CreateUnitDto: CreateUnitDto): Promise<Unit> {
        const { sold, optionId } = CreateUnitDto;

        try {

            const option = await this.optionRepository.findOne({ where: { id: optionId } });
            if (!option) {
                throw new NotFoundException(`Option with ID ${option} not found`);
            }

            const newUnit = this.unitRepository.create({
                sold,
                option,
            });

            return await this.unitRepository.save(newUnit);

        } catch (error) {
        if (error instanceof ConflictException || error instanceof NotFoundException) {
            throw error;
        } else {
            throw new InternalServerErrorException('An unexpected error occurred while creating the unit');
        }
        }
    }

    async getAll(): Promise<Unit[]> {
        try {
            return await this.unitRepository.find({ relations: ['option'] });
        } catch {
            throw new InternalServerErrorException('An unexpected error occurred while retrieving untis');
        }
    }


    async getUnitByOptionId(optionId: string): Promise<Unit[]> {
        try {
            return await this.unitRepository.find({where: { option: { id: optionId }}});
        } catch {
            throw new InternalServerErrorException('An unexpected error occurred while retrieving utins by option');
        }
    }
}
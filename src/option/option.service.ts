import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entity/option.entity';
import { CreateOptionDto } from './dto/createOption.dto';
import { Size } from 'src/size/entity/size.entity';



@Injectable()
export class OptionService {
    constructor(
        @InjectRepository(Option)
        private readonly optionRepository: Repository<Option>,

        @InjectRepository(Size)
        private readonly sizeRepository: Repository<Size>,
    ) {}

    async create(CreateOptionDto: CreateOptionDto): Promise<Option> {
        const { description, imageUrl, sizeId } = CreateOptionDto;

        try {
        const existingOption = await this.optionRepository.findOne({ where: { description } });
        if (existingOption) {
            throw new ConflictException('Option with the same description already exists');
        }

        const size = await this.sizeRepository.findOne({ where: { id: sizeId } });
        if (!size) {
            throw new NotFoundException(`Size with ID ${size} not found`);
        }

        const newOption = this.optionRepository.create({
            description,
            imageUrl,
            size,
        });

        return await this.optionRepository.save(newOption);

        } catch (error) {
        if (error instanceof ConflictException || error instanceof NotFoundException) {
            throw error;
        } else {
            throw new InternalServerErrorException('An unexpected error occurred while creating the option');
        }
        }
    }

    async getAll(): Promise<Option[]> {
        try {
        return await this.optionRepository.find({ relations: ['size'] });
        } catch {
        throw new InternalServerErrorException('An unexpected error occurred while retrieving options');
        }
    }


    async getOptionsBySize(sizeId: string): Promise<Option[]> {
        try {
            return await this.optionRepository.find({where: { size: { id: sizeId }}});
        } catch {
            throw new InternalServerErrorException('An unexpected error occurred while retrieving options');
        }
    }
}
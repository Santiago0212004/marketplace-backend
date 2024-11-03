import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entity/option.entity';
import { CreateOptionDto } from './dto/createOption.dto';
import { Size } from '../size/entity/size.entity';
import { Product } from '../product/entity/product.entity';
import { CurrentUserDto } from '../common/currentUser.dto';
import { UpdateOptionDto } from './dto/updateOption.dto';
import { OptionDto } from './dto/option.dto';
import { ProductDto } from '../product/dto/product.dto';

@Injectable()
export class OptionService {
    constructor(
        @InjectRepository(Option)
        private readonly optionRepository: Repository<Option>,

        @InjectRepository(Size)
        private readonly sizeRepository: Repository<Size>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
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
            availableUnits: 0
        });

        return await this.optionRepository.save(newOption);

        } catch (error) {
            if (error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            } else {
                console.log(error);
                throw new InternalServerErrorException('An unexpected error occurred while creating the option');
            }
        }
    }

    async getAll(): Promise<OptionDto[]> {
        try {
            const options = await this.optionRepository.find({ relations: ['size'] });
            return options.map((option): OptionDto => {
                return {
                    id: option.id,
                    description: option.description,
                    imageUrl: option.imageUrl,
                    availableUnits: option.availableUnits,
                    sizeId: option.size.id
                }
            });
        } catch {
            throw new InternalServerErrorException('An unexpected error occurred while retrieving options');
        }
    }


    async getOptionsBySize(sizeId: string): Promise<OptionDto[]> {
        try {
            const options = await this.optionRepository.find({
                where: { size: { id: sizeId } },
                relations: ['size']
            });
            return options.map((option): OptionDto => {
                return {
                    id: option.id,
                    description: option.description,
                    imageUrl: option.imageUrl,
                    availableUnits: option.availableUnits,
                    sizeId: option.size.id
                }
            });
        } catch {
            throw new InternalServerErrorException('An unexpected error occurred while retrieving options');
        }
    }

    async delete(id: string, user: CurrentUserDto): Promise<void> {
        const option = await this.optionRepository.findOne({
            where: {id},
            relations: ['size', 'size.product']
        });
        if (!option) {
            throw new NotFoundException(`Option with id ${id} not found`);
        }

        const product = await this.productRepository.findOne({
            where: {id: option.size.product.id},
            relations: ['seller']
        });
        if(user.userId !== product.seller.id && user.role.name !== 'admin') {
            throw new ConflictException('You are not authorized to delete this option');
        }

        await this.optionRepository.delete(option.id);
      }


    async update(id: string, updateOptionDto: UpdateOptionDto, user: CurrentUserDto): Promise<void> {
        const option = await this.optionRepository.findOne({
            where: {id},
            relations: ['size', 'size.product']
        });
        if (!option) {
            throw new NotFoundException(`Option with id ${id} not found`);
        }

        const product = await this.productRepository.findOne({
            where: {id: option.size.product.id},
            relations: ['seller']
        });
        if(user.userId !== product.seller.id && user.role.name !== 'admin') {
            throw new ConflictException('You are not authorized to update this option');
        }

        option.description = updateOptionDto.description;
        option.imageUrl = updateOptionDto.imageUrl;

        if(updateOptionDto.availableUnits>=0) {
            option.availableUnits = updateOptionDto.availableUnits;
        } else {
            throw new ConflictException('Available units must be greater than or equal to 0');
        }

        await this.optionRepository.save(option);
    }
}
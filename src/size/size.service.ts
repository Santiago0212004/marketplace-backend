import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from './entity/size.entity';
import { CreateSizeDto } from './dto/createSize.dto';
import { Product } from '../product/entity/product.entity';
import { CurrentUserDto } from '../common/currentUser.dto';
import { SizeDto } from './dto/size.dto';



@Injectable()
export class SizeService {
    constructor(
        @InjectRepository(Size)
        private readonly sizeRepository: Repository<Size>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async create(CreateSizeDto: CreateSizeDto): Promise<Size> {
        const { name, productId } = CreateSizeDto;

        try {
        const existingSize = await this.sizeRepository.findOne({ where: { name } });
        if (existingSize) {
            throw new ConflictException('Size with the same name already exists');
        }

        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const newSize = this.sizeRepository.create({
            name,
            product,
        });

        return await this.sizeRepository.save(newSize);

        } catch (error) {
        if (error instanceof ConflictException || error instanceof NotFoundException) {
            throw error;
        } else {
            throw new InternalServerErrorException('An unexpected error occurred while creating the size');
        }
        }
    }

    async getAll(): Promise<SizeDto[]> {
        try {
            const sizes = await this.sizeRepository.find({ relations: ['product'] });
            return sizes.map(size => ({
                id: size.id,
                name: size.name,
                productId: size.product.id,
            }));
        } catch {
            throw new InternalServerErrorException('An unexpected error occurred while retrieving sizes');
        }
    }

    async getSizesByProductId(productId: string): Promise<SizeDto[]> {
        try {
            const sizes = await this.sizeRepository.find({
                where: { product: { id: productId } },
                relations: ['product'],
            });
            console.log(sizes);
            return sizes.map(size => ({
                id: size.id,
                name: size.name,
                productId: size.product.id,
            }));
        } catch (error) {
            throw new InternalServerErrorException('An unexpected error occurred while retrieving sizes');
        }
    }

    async delete(id: string, user: CurrentUserDto): Promise<void> {
        const size = await this.sizeRepository.findOne({
            where: {id},
            relations: ['product', 'product.seller']
          });
        if (!size) {
            throw new NotFoundException(`Size with id ${id} not found`);
        }

        if(user.userId !== size.product.seller.id && user.role.name !== 'admin') {
            throw new ConflictException('You are not authorized to delete this size');
        }

        await this.sizeRepository.delete(size.id);
    }
}
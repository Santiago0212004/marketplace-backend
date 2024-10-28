import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { Subcategory } from '../subcategory/entity/subcategory.entity';
import { User } from '../user/entity/user.entity';
import { CurrentUserService } from '../common/currentUser.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly currentUserService: CurrentUserService,
  ) {}

  async create(createProductDto: CreateProductDto, user): Promise<Product> {
    const { name, description, price, mainImageUrl, subcategoryId } =
      createProductDto;
      const sellerId: string = user.userId;
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { name },
      });
      if (existingProduct) {
        throw new ConflictException(
          'Product with the same name already exists',
        );
      }

      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: subcategoryId },
      });
      if (!subcategory) {
        throw new NotFoundException(
          `Subcategory with ID ${subcategoryId} not found`,
        );
      }

      const seller = await this.userRepository.findOne({
        where: { id: sellerId },
      });
      if (!seller) {
        throw new NotFoundException(`Seller with ID ${sellerId} not found`);
      }

      const newProduct = this.productRepository.create({
        name,
        description,
        price,
        mainImageUrl,
        subcategory,
        seller,
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An unexpected error occurred while creating the product',
        );
      }
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`No product found with this id:${id}`);
    }

    this.productRepository.remove(product);
  }
  async update(updateProduct: CreateProductDto, id: string): Promise<Product> {
    const newProduct = await this.productRepository.preload({
      id: id,
      ...updateProduct,
    });

    if (!newProduct) {
      throw new NotFoundException('The product could not be updated');
    }
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async getAll(): Promise<ProductDto[]> {
    try {
      const products = await this.productRepository.find({
        relations: ['subcategory', 'subcategory.category'],
      });

      return products.map((product): ProductDto => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          mainImageUrl: product.mainImageUrl,
          subcategory: product.subcategory.name,
          category: product.subcategory.category.name,
        };
      });

    } catch(error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }
}
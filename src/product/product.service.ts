import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { Subcategory } from '../subcategory/entity/subcategory.entity';
import { User } from '../user/entity/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ReviewService } from 'src/review/review.service';
import { ProductDto } from './dto/product.dto';
import { GetProductDto } from './dto/getProduct.dto';
import { CurrentUserDto } from '../common/currentUser.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
@Injectable()
export class ProductService {
 
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => ReviewService))
    private readonly reviewService: ReviewService
  ) {}

  async create(
    createProductDto: CreateProductDto,
    user: CurrentUserDto
  ): Promise<Product> {
    const { name, description, price, mainImageUrl, subcategoryId } =
      createProductDto;
    const sellerId: string = user.userId;
    try {
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

  async remove(id: string, user: CurrentUserDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (product.seller.id !== user.userId && user.role.name !== 'admin') {
      throw new ConflictException(
        'You are not authorized to delete this product',
      );
    }

    if (!product) {
      throw new NotFoundException(`No product found with this id:${id}`);
    }

    await this.productRepository.remove(product);
  }
  async update(
    updateProduct: UpdateProductDto,
    id: string,
    user: CurrentUserDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (product.seller.id !== user.userId && user.role.name !== 'admin') {
      throw new ConflictException(
        'You are not authorized to update this product',
      );
    }

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
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAllFilter(paginationDto: PaginationDto): Promise<ProductDto[]> {
    try {

      const {category, priceMin, priceMax, qualification } = paginationDto
      let whereCondition: any 
      if(category !==undefined){
        whereCondition = {
          subcategory: {
            category: {
              name: category
            }
          }
        };
      }
      
      
      if (priceMin !== undefined && priceMax !== undefined) {
        whereCondition.price = Between(priceMin, priceMax);
      } else if (priceMin !== undefined) {
        whereCondition.price = MoreThan(priceMin);
      } else if (priceMax !== undefined) {
        whereCondition.price = LessThanOrEqual(priceMax);
      }
      
      if (qualification!== undefined){
        whereCondition.rating = MoreThan(qualification);
      }
      
      const products = await this.productRepository.find({
        where: whereCondition,
        relations: ['subcategory', 'subcategory.category'] 
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
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  async getUserProducts(user: CurrentUserDto): Promise<ProductDto[]> {
    try {
      const products = await this.productRepository.find({
        where: { seller: { id: user.userId } },
        relations: ['subcategory', 'subcategory.category', 'seller'],
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
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async findOneProduct(id: string): Promise<GetProductDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    const getProductDto: GetProductDto = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      mainImageUrl: product.mainImageUrl
    }

    return getProductDto
  }

  setRating(product: Product, rating: number) {

    const reviews: any = this.reviewService.getAll(product.id, "product")
    let count: number
    let quantity: number
    for (let i = 0; i < reviews.length; i++) {
      count+=reviews[i]
      quantity+=1
    }
  
    product.rating= (count+rating)/(quantity+1)

    this.productRepository.save(product)
  }

}
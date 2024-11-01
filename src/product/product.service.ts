import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { Subcategory } from '../subcategory/entity/subcategory.entity';
import { User } from '../user/entity/user.entity';
import { CurrentUserService } from '../common/currentUser.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Review } from 'dist/src/review/entity/review.entity';
import { ReviewService } from 'src/review/review.service';


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
    private readonly reviewService: ReviewService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, mainImageUrl, subcategoryId } = createProductDto;
    const sellerId = this.currentUserService.getCurrentUserId();

    try {
      const existingProduct = await this.productRepository.findOne({ where: { name } });
      if (existingProduct) {
        throw new ConflictException('Product with the same name already exists');
      }

      const subcategory = await this.subcategoryRepository.findOne({ 
        where: { id: subcategoryId } 
      });
      if (!subcategory) {
        throw new NotFoundException(`Subcategory with ID ${subcategoryId} not found`);
      }

      const seller = await this.userRepository.findOne({ 
        where: { id: sellerId }
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
        seller
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An unexpected error occurred while creating the product');
      }
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({
      where: { id }
    })

    if(!product){
      throw new NotFoundException(`No product found with this id:${id}`)
    }
    
    this.productRepository.remove(product)
  }
  async update(updateProduct: CreateProductDto, id: string):Promise<Product> {
    
    const newProduct = await this.productRepository.preload({
      id:id, ...updateProduct
    })

    if(!newProduct){
      throw new NotFoundException('The product could not be updated')
    }
    await this.productRepository.save(newProduct)
    return newProduct
  }

  async getAll(paginationDto: PaginationDto): Promise<Product[]> {
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
      
      return await this.productRepository.find({
        where: whereCondition,
        relations: ['seller', 'subcategory'] 
      });

    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving products');
    }
  }

  findOne(id: string) {
    return this.productRepository.findOne({where: { id }})
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
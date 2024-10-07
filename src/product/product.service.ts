import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { Subcategory } from '../subcategory/entity/subcategory.entity';
import { User } from 'src/user/entity/user.entity';
import { CurrentUserService } from 'src/common/currentUser.service';


@Injectable()
export class ProductService {
  
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly currentUserService: CurrentUserService
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

  async getAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where:{
          seller:{id:this.currentUserService.getCurrentUserId()}
        },
        relations: ['seller', 'subcategory']// Opcional: cargar relaciones si las necesitas
      });
    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving products');
    }
  }

  findOne(id: string) {
    return this.productRepository.findOne({where: { id }})
  }
}
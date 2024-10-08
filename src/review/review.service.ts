import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { Review } from './entity/review.entity';
import { ReviewSeller } from './entity/reviewSeller.entity';

@Injectable()
export class ReviewService {

    constructor(
        private readonly productService: ProductService,
        private readonly userService: UserService,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(ReviewSeller)
        private readonly reviewSellerRepository: Repository<ReviewSeller>,
        
      ) {}
    async getAll(id: string, typeReview: string): Promise<Review[] | ReviewSeller[]> {
        try{
            if(typeReview === 'product'){
                return await this.reviewRepository.find({ where:{
                     product:{ id }
                    }})
            }
            return await this.reviewSellerRepository.find({ where:{
                buyer:{ id }
               }})
        }catch{
            throw new InternalServerErrorException('An unexpected error occurred while retrieving products');
        }
       
    }
    async create(createReviewDto: CreateReviewDto, typeReview: string): Promise<Review | ReviewSeller> {

        const {rating, comment, id} = createReviewDto

        if(typeReview === 'product'){
           
            const product = await this.productService.findOne(id)

            if(!product){
                throw new NotFoundException(`Product with id ${id} not found`)
            }

            const newReview = this.reviewRepository.create({
                rating, comment, product
            })

            return await this.reviewRepository.save(newReview)
        }
        const seller = await this.userService.findById(id)

        if(!seller){
            throw new NotFoundException(`Seller with id ${id} not found`)
        }

        const newSeller = this.reviewSellerRepository.create({
            rating, comment, buyer:seller
        })

        return await this.reviewSellerRepository.save(newSeller)//
    }
}

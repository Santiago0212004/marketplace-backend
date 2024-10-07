import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { ReviewSeller } from './entity/reviewSeller.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ProductModule } from '../product/product.module'
import { UserModule } from '../user/user.module'


@Module({
  imports: [TypeOrmModule.forFeature([Review]), TypeOrmModule.forFeature([ReviewSeller]), ProductModule,UserModule],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports:[ReviewService]
})
export class ReviewModule {}

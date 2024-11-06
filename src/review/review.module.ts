import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { ReviewSeller } from './entity/reviewSeller.entity';
import { ReviewService } from 'src/review/review.service';
import { ReviewController } from './review.controller';
import { ProductModule } from 'src/product/product.module'
import { UserModule } from 'src/user/user.module'


@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewSeller]),forwardRef(() => ProductModule),forwardRef(() => UserModule)],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports:[ReviewService]
})
export class ReviewModule {}


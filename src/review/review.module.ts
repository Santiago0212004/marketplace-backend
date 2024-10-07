import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [],
  exports: [],
})
export class ReviewModule {}
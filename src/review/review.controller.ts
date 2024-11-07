import { Body, Controller, Post, UseGuards, Param, ParseUUIDPipe, Get} from '@nestjs/common';
import { CreateReviewDto } from './dto/createReview.dto';
import { ReviewService } from './review.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('review')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post('product')
    @Roles('buyer','seller', 'admin')
    async createReviewProduct(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.create(createReviewDto, 'product');
    }

    @Post('seller')
    @Roles('buyer','seller', 'admin')
    async createReviewSeller(@Body() createReviewDto: CreateReviewDto){
        return this.reviewService.create(createReviewDto, 'seller');
    }

    @Get(':productId')
    @Roles('buyer','seller', 'admin')
    async getReviewsProduct(@Param('productId', ParseUUIDPipe) id:string){
        return this.reviewService.getAll(id, 'product')
    }

    @Get(':sellerId')
    @Roles('buyer','seller', 'admin')
    async getReviewsSeller(@Param('sellerId', ParseUUIDPipe) id:string){
        return this.reviewService.getAll(id, 'seller')
    }
}

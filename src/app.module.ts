// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProductModule } from './product/product.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CategoryModule } from './category/category.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { SizeModule } from './size/size.module';
import { OptionModule } from './option/option.module';
import { UnitModule } from './unit/unit.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    UnitModule,
    OrderModule,
    OptionModule,
    SizeModule,
    ProductModule,
    SubcategoryModule,
    CategoryModule,
    ReviewModule
  ],
  controllers: [ReviewController],
  providers: [],
})
export class AppModule {}

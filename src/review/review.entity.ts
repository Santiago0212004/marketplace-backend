import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Product } from '../product/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.reviews)
  buyer: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}

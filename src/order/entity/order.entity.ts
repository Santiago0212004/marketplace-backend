import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Product } from '../../product/entity/product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => User, (user) => user.orders)
  buyer: User;

  @ManyToOne(() => Product, (product) => product.orders)
  product: Product;
}

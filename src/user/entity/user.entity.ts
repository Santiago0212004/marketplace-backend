import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/product.entity';
import { Order } from '../../order/order.entity';
import { Review } from '../../review/review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: ['buyer', 'seller', 'admin'] })
  role: string;

  @OneToMany(() => Product, (product) => product.seller, { cascade: true })
  products: Product[];

  @OneToMany(() => Order, (order) => order.buyer, { cascade: true })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.buyer, { cascade: true })
  reviews: Review[];
}

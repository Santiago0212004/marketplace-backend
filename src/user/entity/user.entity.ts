import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Product } from '../../product/product.entity';
import { Order } from '../../order/order.entity';
import { Review } from '../../review/review.entity';
import { Role } from '../../role/role.entity';

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

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Product, (product) => product.seller, { cascade: true })
  products: Product[];

  @OneToMany(() => Order, (order) => order.buyer, { cascade: true })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.buyer, { cascade: true })
  reviews: Review[];
}

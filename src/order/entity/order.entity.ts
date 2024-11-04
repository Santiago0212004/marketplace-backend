import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Option } from '../../option/entity/option.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.orders)
  buyer: User;

  @ManyToOne(() => Option, (option) => option.orders)
  option: Option;

  @Column()
  amount: number;

  @Column()
  totalPrice: number;
}

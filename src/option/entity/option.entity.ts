import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Size } from '../../size/entity/size.entity';
import { Order } from '../../order/entity/order.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Size, (size) => size.options)
  size: Size;

  @OneToMany(() => Order, (order) => order.option)
  orders: Order[];

  @Column()
  availableUnits: number;
}

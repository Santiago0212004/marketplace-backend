import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';
import { Option } from '../option/option.entity';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Product, (product) => product.sizes)
  product: Product;

  @OneToMany(() => Option, (option) => option.size, { cascade: true })
  options: Option[];
}

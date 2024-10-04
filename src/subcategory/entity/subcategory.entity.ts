import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { Product } from '../../product/entity/product.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory)
  products: Product[];
}

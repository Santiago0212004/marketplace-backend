import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { Product } from '../../product/entity/product.entity';
import { User } from '../../user/entity/user.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories, { onDelete: 'CASCADE' })
  category: Category;

  @ManyToOne(() => User, (seller) => seller.subcategories, { onDelete: 'CASCADE' })
  seller: User;

  @OneToMany(() => Product, (product) => product.subcategory, { cascade: true })
  products: Product[];
}

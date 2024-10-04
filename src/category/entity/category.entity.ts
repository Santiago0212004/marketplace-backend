import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subcategory } from '../../subcategory/entity/subcategory.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];
}

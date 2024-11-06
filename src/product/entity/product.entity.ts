import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Review } from '../../review/entity/review.entity';
import { Size } from '../../size/entity/size.entity';
import { Subcategory } from '../../subcategory/entity/subcategory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  mainImageUrl: string;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  seller: User;

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Size, (size) => size.product, { cascade: true })
  sizes: Size[];

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, { onDelete: 'CASCADE' })
  subcategory: Subcategory;

  @Column('decimal', { nullable: true, default: 0 })
  rating?: number;

}

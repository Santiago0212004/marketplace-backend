import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Size } from '../size/size.entity';

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
}

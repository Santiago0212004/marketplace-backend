import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Size } from '../size/size.entity';
import { Unit } from 'src/unit/unit.entity';

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

  @OneToMany(() => Unit, (unit) => unit.option)
  units: Unit[];
}

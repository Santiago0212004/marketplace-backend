import { Option } from "../../option/entity/option.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("units")
export class Unit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Option, (option) => option.units)
    option: Option;

    @Column()
    sold: boolean;
}

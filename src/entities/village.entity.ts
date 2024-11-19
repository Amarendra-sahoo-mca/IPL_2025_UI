import { Status } from "src/enums/common.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("village")
export class VillageEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable : false
    })
    gram_panchayat_id: number;
    
    @Column({
        nullable : false
    })
    block_id: number;

    @Column()
    code: string;
    
    @Column()
    name: string;

    @Column()
    house_hold: string;
    
    @Column()
    population: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.ACTIVE,
        comment: '0- Active, 1- InActive'
    })
    status: number;
    
    @CreateDateColumn()
    created_on: Date;

    @UpdateDateColumn()
    modified_on: Date;
}
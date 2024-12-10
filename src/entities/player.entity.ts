import { player_Role, player_status } from "src/enums/common.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("players")
export class playersEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable : false
    })
    name: string;
    
    @Column({
        nullable : true
    })
    base_price: number;

    @Column({
        nullable : false
    })
    sell_price: number;
    
    @Column({
        type: "enum",
        enum: player_Role,
        comment: '1- BatsMan, 2- Bowler, 3- AllRounder',
        nullable: true
    })
    designation: number;
    
    @Column()
    from: string;

    @Column()
    team_buy: number;

    @Column({nullable :true})
    age: number;

    @Column({nullable : true})
    photo: string;

    @Column({
        type: "enum",
        enum: player_status,
        comment: '0- written, 1- Buy'
    })
    status: number;
    
    @CreateDateColumn()
    created_on: Date;

    @UpdateDateColumn()
    modified_on: Date;
}
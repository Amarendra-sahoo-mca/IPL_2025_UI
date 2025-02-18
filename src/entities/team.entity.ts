import { player_Role, player_status } from "src/enums/common.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("teams")
export class TeamEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable : false
    })
    name: string;
    
    @Column({
        type: "bigint",
        nullable : true
    })
    money_have: string;

    @Column({
        type: "bigint",
        
    })
    spend_money: string;

    @Column({
        type: "bigint",
        
    })
    rest_money: string;

    @Column()
    title_own: number;
    
    @Column()
    number_of_player: number;

    @Column()
    winning_year: string;

    @Column()
    captain: number;

    @Column()
    vice_captain: number;

    @Column()
    short_name: string;

    @Column({nullable : true})
    logo: string;

    @Column({nullable : true})
    banner: string;
    
    @CreateDateColumn()
    created_on: Date;

    @UpdateDateColumn()
    modified_on: Date;
}
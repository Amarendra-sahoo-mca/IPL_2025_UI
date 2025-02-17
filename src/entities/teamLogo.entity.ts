import { player_Role, player_status } from "src/enums/common.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("team_logo")
export class TeamLogoEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable : false
    })
    team_id: number;
    
    @Column({
        nullable : true
    })
    logo: string;
    
    @CreateDateColumn()
    created_on: Date;

    @UpdateDateColumn()
    modified_on: Date;
}
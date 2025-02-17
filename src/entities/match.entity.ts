import { player_Role, player_status } from "src/enums/common.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("matches")
export class MatchEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    matchOrder: string;
    
    @Column()
    groundName: string;

    @Column()
    matchDate: string;
    
    @Column()
    matchTime: string;

    @Column()
    homeTeam: number;

    @Column()
    awayTeam: number;

    @Column({
        nullable: true
    })
    wonTeam: number;

    @Column({
        nullable: true
    })
    homeTeamScore: string;

    @Column({
        nullable: true
    })
    awayTeamScore: string;

    @CreateDateColumn()
    created_on: Date;

    @UpdateDateColumn()
    modified_on: Date;
}
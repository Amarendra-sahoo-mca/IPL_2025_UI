import { ApiProperty } from "@nestjs/swagger";


export class LogoDto{
    @ApiProperty({
        description: `team_id`,
    })
    team_id:number;

    @ApiProperty({
        description: `logo`,
    })
    logo:string;
}
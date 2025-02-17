import { ApiProperty } from "@nestjs/swagger";


export class MatchDto{
    @ApiProperty({
        description: `name`,
    })
    name:string;

    @ApiProperty({
        description: `base_price`,
    })
    base_price:number;

    @ApiProperty({
        description: `sell_price`,
    })
    sell_price:number;

    @ApiProperty({
        description: `designation`,
    })
    designation:number;

    @ApiProperty({
        description: `from`,
    })
    from:string;

    @ApiProperty({
        description: `team_buy`,
    })
    team_buy:number;

    @ApiProperty({
        description: `age`,
    })
    age:number;

    @ApiProperty({
        description: `photo`,
    })
    photo:string;

    @ApiProperty({
        description: `status`,
    })
    status:number;
}
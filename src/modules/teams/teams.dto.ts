import { ApiProperty } from "@nestjs/swagger";


export class teamDto{
    @ApiProperty({
        description: `name`,
    })
    name:string;

    @ApiProperty({
        description: `money_have`,
    })
    namoney_have:string;

    @ApiProperty({
        description: `spend_money`,
    })
    spend_money:string;

    @ApiProperty({
        description: `rest_money`,
    })
    rest_money:string;

    @ApiProperty({
        description: `title_own`,
    })
    title_own:number;

    @ApiProperty({
        description: `captain`,
    })
    captain:number;

    @ApiProperty({
        description: `number_of_player`,
    })
    number_of_player:number;
    
    @ApiProperty({
        description: `short_name`,
    })
    short_name:string;

    @ApiProperty({
        description: `logo`,
    })
    logo:string;

    @ApiProperty({
        description: `winning_year`,
    })
    winning_year:string;
}
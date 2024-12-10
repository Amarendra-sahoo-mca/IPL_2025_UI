import { ApiPropertyOptional } from "@nestjs/swagger";
import { Sorting } from "src/enums/common.enum";


export abstract class PaginationSortingDTO {

    @ApiPropertyOptional({
        description: `page`,
        example: 1,
        default: 1,
        minimum: 1,
    })
    page: number;

    @ApiPropertyOptional({
        description: `sortBy`,
    })
    sortBy: string;

    @ApiPropertyOptional({
        description: `ASC,DESC`,
        example: Sorting.ASC,
        default: Sorting.ASC,
    })
    sortOrder: 'ASC' | 'DESC';
}
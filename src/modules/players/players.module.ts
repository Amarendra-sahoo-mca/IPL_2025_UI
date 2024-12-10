import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { playersController } from "./players.controller";
import { playersService } from "./players.service";
import { playersEntity } from "src/entities/player.entity";
import { ExcelService } from "src/utils/globalServices/excel.service";
import { TeamEntity } from "src/entities/team.entity";

@ Module({
    imports: [
        TypeOrmModule.forFeature([playersEntity,TeamEntity])
    ],
    controllers: [
        playersController
    ],
    providers: [
        playersService,
        ExcelService
    ],
    exports: []
})
  export class playersModule {}
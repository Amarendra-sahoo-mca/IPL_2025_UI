import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamEntity } from "src/entities/team.entity";
import {   TeamController } from "./teams.controller";
import {   TeamService } from "./teams.service";
import { TeamLogoEntity } from "src/entities/teamLogo.entity";
import { ExcelService } from "src/utils/globalServices/excel.service";

@ Module({
    imports: [
        TypeOrmModule.forFeature([TeamEntity,TeamLogoEntity])
    ],
    controllers: [
          TeamController
    ],
    providers: [
          TeamService,ExcelService
    ],
    exports: []
})
  export class TeamModule {}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamEntity } from "src/entities/team.entity";
import {   TeamController } from "./teams.controller";
import {   TeamService } from "./teams.service";
import { TeamLogoEntity } from "src/entities/teamLogo.entity";

@ Module({
    imports: [
        TypeOrmModule.forFeature([TeamEntity,TeamLogoEntity])
    ],
    controllers: [
          TeamController
    ],
    providers: [
          TeamService
    ],
    exports: []
})
  export class TeamModule {}
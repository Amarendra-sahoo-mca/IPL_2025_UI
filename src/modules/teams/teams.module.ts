import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamEntity } from "src/entities/team.entity";
import { teamController } from "./teams.controller";
import { teamService } from "./teams.service";
import { TeamLogoEntity } from "src/entities/teamLogo.entity";

@ Module({
    imports: [
        TypeOrmModule.forFeature([TeamEntity,TeamLogoEntity])
    ],
    controllers: [
        teamController
    ],
    providers: [
        teamService
    ],
    exports: []
})
  export class TeamModule {}
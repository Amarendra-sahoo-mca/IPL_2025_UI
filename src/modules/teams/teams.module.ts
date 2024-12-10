import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamEntity } from "src/entities/team.entity";
import { teamController } from "./teams.controller";
import { teamService } from "./teams.service";

@ Module({
    imports: [
        TypeOrmModule.forFeature([TeamEntity])
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
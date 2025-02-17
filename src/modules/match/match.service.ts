import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DropdownType, IResponse } from 'src/interfaces/api.response';

import Messages from 'src/constants/messages';

import { PaginationSortingDTO } from 'src/utils/pagination.dto';
import { applyPagination, applySorting, matchdetails } from 'src/utils/common';

import { ExcelService } from 'src/utils/globalServices/excel.service';
import { TeamEntity } from 'src/entities/team.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { MatchEntity } from 'src/entities/match.entity';
import { MatchDto } from './match.dto';
import { Team } from 'src/enums/common.enum';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchEntity) private repository: Repository<MatchEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    private readonly excelService: ExcelService,
  ) {}

  async setAll() {
    try {
      await this.repository.clear();

      await this.repository.query(`ALTER TABLE matches AUTO_INCREMENT = 1`);
      await Promise.all(
        matchdetails.map(async (match: any) => {
          match.homeTeam = Team[match.homeTeamName as keyof typeof Team] ;
          match.awayTeam = Team[match.awayTeamName as keyof typeof Team] ;
          const { homeTeamName, awayTeamName, ...payload } = match;
          // console.log(match.homeTeamName,payload.homeTeam);
          
          await this.repository.save(payload);
        }),
      );

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: `match imported successfully`,
        data: null,
      } as IResponse;
    } catch (err: any) {
      const response: IResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: `unable to store`,
        data: err,
      };
      return response;
    }
  }
}

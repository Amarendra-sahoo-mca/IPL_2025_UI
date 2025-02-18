import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DropdownType, IResponse } from 'src/interfaces/api.response';

import Messages from 'src/constants/messages';



import { PaginationSortingDTO } from 'src/utils/pagination.dto';
import { applyPagination, applySorting } from 'src/utils/common';

import { ExcelService } from 'src/utils/globalServices/excel.service';
import { TeamEntity } from 'src/entities/team.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { teamDto } from './teams.dto';



@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity) private repository: Repository<TeamEntity>,
   
    private readonly excelService: ExcelService
  ) {}

  async findAll() {

    try{
    // const pagination = applyPagination(queryParams.page);
    // const order = applySorting(queryParams.sortBy, queryParams.sortOrder, TeamEntity);

    const res = this.repository.createQueryBuilder('player')
    
    
    // if (pagination.skip) {
    //   res.skip(pagination.skip);
    // }
    // if (pagination.take) {
    //   res.take(pagination.take);
    // }
    // if (order) {
    //   Object.keys(order).forEach((key) => {
    //     res.addOrderBy(`user.${key}`, order[key]);
    //   });
    // }
    const response = await res.getMany();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: `team`,

      data: response,
    } as IResponse;
  }catch(err:any){
    const response: IResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      success: false,
      message: `no data found`,
      data: err,
    };
    return response;
  }
  }

  async update(id: number,files:Express.Multer.File[]) {
    try {   
    const response = await this.findOne(id);
    const user = response.data;
    if (!user) {
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `team Document ${Messages.NOT_FOUND}`,
            data: null,
        };
        return response;
      }
        if(files.length > 0){
          user.banner = files[0].path;
        }
        // updatedObj.status = 2;
        const  updatedResponse = await this.repository.update(id, user);
         
        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: `team banner ${Messages.UPDATE}`,
            data: updatedResponse
        };
    } catch (error: any) {
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `team banner ${Messages.UPDATE_FAILURE}`,
            data: error,
        };
        return response;
    }
}


  async findOne(id: number) {
    const response: TeamEntity = await this.repository.findOneBy({ id });
    return response
      ? ({
          statusCode: HttpStatus.OK,
          success: true,
          message: `team by id`,
          data: response,
        } as IResponse)
      : ({
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: `team not found`,
          data: null,
        } as IResponse);
  }
}

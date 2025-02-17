import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DropdownType, IResponse } from 'src/interfaces/api.response';
import { Repository } from 'typeorm';
import Messages from 'src/constants/messages';

import { teamDto } from './teams.dto';

import { PaginationSortingDTO } from 'src/utils/pagination.dto';
import { applyPagination, applySorting } from 'src/utils/common';
import { TeamEntity } from 'src/entities/team.entity';
import { playersEntity } from 'src/entities/player.entity';
import { LogoDto } from './logo.dto';
import { TeamLogoEntity } from 'src/entities/teamLogo.entity';

@Injectable()
export class teamService {
  constructor(
    @InjectRepository(TeamEntity) private repository: Repository<TeamEntity>,
    @InjectRepository(TeamLogoEntity) private logorepository: Repository<TeamLogoEntity>,
  
  ) {}

  async findAll() {
    try{
    const res = this.repository.createQueryBuilder('team')
    .innerJoinAndMapOne('team.logo',TeamLogoEntity, 'logo', 'logo.team_id = team.id');

    
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
      message: `Team ${Messages.UPDATE_FAILURE}`,
      data: err,
  };
  return response;
  }
  }

  async update(id: number, userdocumentDTO: teamDto ,files:Express.Multer.File[]) {
        
    const response = await this.findOne(id);
    const user = response.data;
    
    if (!user || user.length == 0) {
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `team Document ${Messages.NOT_FOUND}`,
            data: null,
        };
        return response;
    }
    try {

        const filteredDto = Object.fromEntries(
            Object.entries(userdocumentDTO).filter(([_, value]) => value !== '' && value !== null)
          );

           
        const updatedObj = this.repository.merge(user, filteredDto);
    
        if(files.length > 0){
            
            
            updatedObj.logo = files[0].path;
        }
        // updatedObj.status = 2;
        const  updatedResponse = await this.repository.update(id, updatedObj);
         
        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: `Team ${Messages.UPDATE}`,
            data: updatedResponse
        };
    } catch (error: any) {
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `Team ${Messages.UPDATE_FAILURE}`,
            data: error,
        };
        return response;
    }
}


  async findOne(id: number) {
    const response: any = await this.repository
    .createQueryBuilder('team')
    .innerJoinAndMapMany('team.players',playersEntity, 'players', 'players.team_buy = team.id')
    .where('team.id = :id',{id:id})
    .getOne();
   

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

  

  async save(Dtos: teamDto ,files:Express.Multer.File[]) {
    try {
            if(files[0]){
              Dtos.logo = files[0].path;
            }
            const savedDocument = await this.repository.save(Dtos);
            
        
            
           
        const response: IResponse = {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: `team created`,
            data: savedDocument,
        };
        return response;
    } catch (error: any) {            
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `try again User-Document unable to submit`,
            data: error.message,
        };
        return response;
    }
}
  async save2(Dtos: LogoDto[] ,files:Express.Multer.File[]) {
    try {  

      
      let savedDocument = []   
          for(let data=0 ; data<Dtos.length;data++){
            if(files[data]){
              Dtos[data].logo = files[data].path;
              const res = await this.logorepository.save(Dtos[data]);
              savedDocument.push(res);
            }else{

              break;
            }
          }
        const response: IResponse = {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: `logo saved`,
            data: savedDocument,
        };
        return response;
    } catch (error: any) {            
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `try again User-Document unable to submit`,
            data: error.message,
        };
        return response;
    }
}

}

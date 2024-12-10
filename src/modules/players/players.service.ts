import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DropdownType, IResponse } from 'src/interfaces/api.response';
<<<<<<< HEAD
import { FindOptionsWhere, Like, Repository } from 'typeorm';
=======
import { Repository } from 'typeorm';
>>>>>>> 54cd900 (players import api creation)
import Messages from 'src/constants/messages';

import { playersDto } from './players.dto';

import { PaginationSortingDTO } from 'src/utils/pagination.dto';
import { applyPagination, applySorting } from 'src/utils/common';
import { playersEntity } from 'src/entities/player.entity';
import { ExcelService } from 'src/utils/globalServices/excel.service';
import { TeamEntity } from 'src/entities/team.entity';


@Injectable()
export class playersService {
  constructor(
    @InjectRepository(playersEntity) private repository: Repository<playersEntity>,
    @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
    private readonly excelService: ExcelService
  ) {}

  async findAll(queryParams: PaginationSortingDTO) {
<<<<<<< HEAD
    try{
    const pagination = applyPagination(queryParams.page);
    const order = applySorting(queryParams.sortBy, queryParams.sortOrder, playersEntity);

    const res = this.repository.createQueryBuilder('player')
    .innerJoinAndMapOne('player.team',TeamEntity, 'team', 'player.team_buy = team.id');
    
    if (pagination.skip) {
      res.skip(pagination.skip);
    }
    if (pagination.take) {
      res.take(pagination.take);
    }
    if (order) {
      Object.keys(order).forEach((key) => {
        res.addOrderBy(`user.${key}`, order[key]);
      });
    }
    const response = await res.getMany();
=======
    const pagination = applyPagination(queryParams.page);
    const order = applySorting(queryParams.sortBy, queryParams.sortOrder, playersEntity);

    const res = await this.repository.find({
      ...pagination,
      order: order,
    });
>>>>>>> 54cd900 (players import api creation)
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: `players`,
<<<<<<< HEAD
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


  async findAllbyname(queryParams: PaginationSortingDTO, name:string) {
    const where: FindOptionsWhere<any> = {};
    const pagination = applyPagination(queryParams.page);
    const order = applySorting(queryParams.sortBy, queryParams.sortOrder, playersEntity);

    if (name) {
      where.name = Like(`%${name}%`);
    }
    try{
     const res = this.repository.createQueryBuilder('player')
    .innerJoinAndMapOne('player.team',TeamEntity, 'team', 'player.team_buy = team.id')  
    .where(where);

    if (pagination.skip) {
      res.skip(pagination.skip);
    }
    if (pagination.take) {
      res.take(pagination.take);
    }
    if (order) {
      Object.keys(order).forEach((key) => {
        res.addOrderBy(`user.${key}`, order[key]);
      });
    }
    const response = await res.getMany();
    
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: `players by name`,
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
=======
      data: res,
    } as IResponse;
>>>>>>> 54cd900 (players import api creation)
  }

  async importFromExcel(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      // Parse Excel file
      const data: any[] = await this.excelService.parseExcelFile(file);

      if (!data || data.length === 0) {
        throw new BadRequestException('Excel file is empty');
      }

      // Validate headers
      if (!data[0].hasOwnProperty('name')) {
        throw new BadRequestException('Excel file must contain a "name" column');
      }

      // Validate and transform data
      const errors: string[] = [];
      let SellPrice = 0;
      const validDesignations: Partial<any>[] = await Promise.all(data
        .map(async (row, index) => {
          const rowNumber = index + 1; // 1-based index for user-friendly error messages

          // Validate name (required)
          if (!row.name || typeof row.name !== 'string' || row.name.trim() === '') {
            errors.push(`Row ${rowNumber}: Name is required and cannot be empty`);
            return null; // Return null for invalid rows
          }
          SellPrice += row.sell_price
          


          // If row is valid, return the designation object
          return row;
        })
        .filter(Boolean)); // Remove null values from the array

      // If there are any validation errors, throw them
      if (errors.length > 0) {
        throw new BadRequestException({
          message: 'Validation errors in Excel data',
          errors: errors,
        });
      }

      // If no valid data found
      if (validDesignations.length === 0) {
        throw new BadRequestException('No valid data found in the Excel file');
      }

      // Save to database
      await this.repository.save(validDesignations.map(data => this.repository.create(data)));   
      
      const team_data = await this.teamRepository.findOneBy({ id: validDesignations[1].team_buy });
          console.log('new data', team_data, '\n---------------\n');
          let spendMoney = parseInt(team_data.spend_money);
          spendMoney += SellPrice;
          const restmoney = parseInt(team_data.money_have) - spendMoney;
          team_data.spend_money = spendMoney.toString();
          team_data.rest_money = restmoney.toString();
<<<<<<< HEAD
          team_data.number_of_player = validDesignations.length;
=======
>>>>>>> 54cd900 (players import api creation)
          console.log('update data ----------------------\n', team_data);

          const save_responce = await this.teamRepository.update(team_data.id, team_data);
      const response: IResponse = {
        statusCode: HttpStatus.OK,
        success: true,
        message: `${validDesignations.length} Data imported successfully`,
        data: validDesignations,
      }
        return response;
    } catch (error) {
      // Handle specific BadRequestException errors
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Log unexpected errors
      console.error('Excel import error:', error);

      // Return a user-friendly error message
      throw new BadRequestException({
        message: 'Failed to process Excel file',
        error: error.message,
      });
    }
  }

  async update(id: number, userdocumentDTO: playersDto ,files:Express.Multer.File[]) {
        
    const response = await this.findOne(id);
    const user = response.data;
    
    if (!user || user.length == 0) {
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `players Document ${Messages.NOT_FOUND}`,
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
            
            
            updatedObj.photo = files[0].path;
        }
        // updatedObj.status = 2;
        const  updatedResponse = await this.repository.update(id, updatedObj);
         
        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: `players ${Messages.UPDATE}`,
            data: updatedResponse
        };
    } catch (error: any) {
        
        
        const response: IResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            message: `players ${Messages.UPDATE_FAILURE}`,
            data: error,
        };
        return response;
    }
}


  async findOne(id: number) {
    const response: playersEntity = await this.repository.findOneBy({ id });
   

    return response
      ? ({
          statusCode: HttpStatus.OK,
          success: true,
          message: `players by id`,
          data: response,
        } as IResponse)
      : ({
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: `players not found`,
          data: null,
        } as IResponse);
  }

  

  async save(Dtos: playersDto ,files:Express.Multer.File[]) {
    try {
            if(files[0]){
              Dtos.photo = files[0].path;
            }
            const savedDocument = await this.repository.save(Dtos);
            
           
        const response: IResponse = {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: `players created`,
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

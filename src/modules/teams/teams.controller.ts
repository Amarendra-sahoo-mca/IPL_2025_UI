
import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { diskStorage } from 'multer';
import * as fs from 'fs';

// import { FileUploadDto } from "../designation/designation.controller";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { PaginationSortingDTO } from "src/utils/pagination.dto";
import { MulterHelper } from "src/middlewires/multer.helper";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { join } from "path";
import { Response } from 'express';
import { TeamService } from "./teams.service";


export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

@Controller("team")
@ApiTags("team")
export class TeamController{

     constructor(
        private terminalService:TeamService,
        
     ){}

    @Get("all")
    @ApiOperation({ summary: "List All teams" })
    getAll(){
         return this.terminalService.findAll();
    }

    @Get(":id")
    // @UseGuards(JwtAuthGuard)
    // @Roles(Role.ADMIN)
    @ApiOperation({ summary: "List one team" })
    findOne(@Param("id") id:number) {
        return this.terminalService.findOne(id);
    }


    

    @Patch("update_banner/:id")
    // @UseGuards(JwtAuthGuard)
    // @Roles(Role.ADMIN)
    @UseInterceptors(
      AnyFilesInterceptor({
        storage: diskStorage({
          destination: MulterHelper.destinationPath,
          filename: MulterHelper.customFileName,
        }),
      })
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          'banner_path': {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })
    @ApiOperation({ summary: "Update team banner" })
    update(
      @Param("id") id: string,
      
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {       
      return this.terminalService.update(parseInt(id), files);
    }
    
} 



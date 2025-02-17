import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { MatchDto } from "./match.dto";
// import { FileUploadDto } from "../designation/designation.controller";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { PaginationSortingDTO } from "src/utils/pagination.dto";
import { MatchService } from "./match.service";
import { MulterHelper } from "src/middlewires/multer.helper";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { join } from "path";
import { Response } from 'express';


export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

@Controller("match")
@ApiTags("Match")
export class MatchController{

     constructor(
        private terminalService:MatchService,
       
     ){}

    @Get("getall")
    @ApiOperation({ summary: "List All Matchs" })
    getAll(@Query() queryParams: PaginationSortingDTO){
        //  return this.terminalService.findAll(queryParams);
    }

    @Get("saveall")
    @ApiOperation({ summary: "List All Matchs" })
    getxAll(){
          return this.terminalService.setAll();
    }


    
    
} 



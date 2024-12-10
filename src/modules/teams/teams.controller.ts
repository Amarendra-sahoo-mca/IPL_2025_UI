import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { teamDto } from "./teams.dto";
// import { FileUploadDto } from "../designation/designation.controller";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { PaginationSortingDTO } from "src/utils/pagination.dto";
import { teamService } from "./teams.service";
import { MulterHelper } from "src/middlewires/multer.helper";
import { InjectRepository } from "@nestjs/typeorm";
import { TeamEntity } from "src/entities/team.entity";
import { Repository } from "typeorm";
import { join } from "path";
import { Response } from 'express';


@Controller("team")
@ApiTags("team")
export class teamController{

     constructor(
        private terminalService:teamService,
        @InjectRepository(TeamEntity) private repository: Repository<TeamEntity>,
     ){}

    @Get("all")
    @ApiOperation({ summary: "List All teams" })
    getAll(@Query() queryParams: PaginationSortingDTO){
         return this.terminalService.findAll(queryParams);
    }

   

    @Get(":id")
    // @UseGuards(JwtAuthGuard)
    // @Roles(Role.ADMIN)
    @ApiOperation({ summary: "List one team" })
    findOne(@Param("id") id:number) {
        return this.terminalService.findOne(id);
    }

    @Post("create")
    @ApiOperation({ summary: 'Create teams' })
    @UseInterceptors(
      AnyFilesInterceptor({
        storage: diskStorage({
          destination:  MulterHelper.destinationPath,
          filename: MulterHelper.customFileName,
        }),
      }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          documentDTO: {
            type: 'string',
            description: 'JSON string of UserSelfRegDto',
          },
          document_path: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
          
        },
      },
    })async save(@Body() body: any, 
     @UploadedFiles() files: Express.Multer.File[],) {
      let documentDTO: teamDto;
      try {
        documentDTO = JSON.parse(body.documentDTO);
      } catch (error) {
        console.error('Error parsing userDTO:', error);
        throw new BadRequestException('Invalid JSON in userDTO. Please check the format.');
      }
        return this.terminalService.save(documentDTO, files);
    }

    @Get('file/:docId')
    async getFile(@Param('docId') docId: number, @Res() res: Response) {
      const document = await this.repository.findOneBy({id: docId } );
      
      if (!document) {
        throw new NotFoundException('Document not found');
      }
  
      const fullPath = join(process.cwd(), document.logo);
  
      if (!fs.existsSync(fullPath)) {
        throw new NotFoundException('File not found');
      }
  
      // Stream file to response
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.logo.split('\\').pop()}"`,
      });
      fs.createReadStream(fullPath).pipe(res);
    }

    @Patch("update/:id")
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
          dtos: {
            type: 'string',
            description: 'JSON string of UserDocumentDto array',
          },
          'document_path': {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })
    @ApiOperation({ summary: "Update team data" })
    update(
      @Param("id") id: string,
      @Body() userDTO: any,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
     
      if (!userDTO.dtos) {
        throw new BadRequestException('No DTOs received. Make sure you are sending a "dtos" field.');
      }
    
      let dtos: teamDto;
      try {
        dtos = JSON.parse(userDTO.dtos);
      } catch (error) {
        console.error('Error parsing dtos:', error);
        throw new BadRequestException('Invalid JSON in dtos field. Please check the format.');
      }
       
    
      return this.terminalService.update(parseInt(id), dtos, files);
    }
    
} 



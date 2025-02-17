import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { playersDto } from "./players.dto";
// import { FileUploadDto } from "../designation/designation.controller";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { PaginationSortingDTO } from "src/utils/pagination.dto";
import { playersService } from "./players.service";
import { MulterHelper } from "src/middlewires/multer.helper";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { join } from "path";
import { Response } from 'express';
import { playersEntity } from "src/entities/player.entity";

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

@Controller("players")
@ApiTags("players")
export class playersController{

     constructor(
        private terminalService:playersService,
        @InjectRepository(playersEntity) private repository: Repository<playersEntity>,
     ){}

    @Get("all")
    @ApiOperation({ summary: "List All playerss" })
    getAll(@Query() queryParams: PaginationSortingDTO){
         return this.terminalService.findAll(queryParams);
    }


    @Get("byname/:name")
    @ApiOperation({ summary: "List playerss by name" })
    getAllbyname(@Param('name') name:string,@Query() queryParams: PaginationSortingDTO){
         return this.terminalService.findAllbyname(queryParams,name);
    }
   

    @Get(":id")
    // @UseGuards(JwtAuthGuard)
    // @Roles(Role.ADMIN)
    @ApiOperation({ summary: "List one players" })
    findOne(@Param("id") id:number) {
        return this.terminalService.findOne(id);
    }

    @Post("create")
    @ApiOperation({ summary: 'Create playerss' })
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
      let documentDTO: playersDto;
      try {
        documentDTO = JSON.parse(body.documentDTO);
      } catch (error) {
        console.error('Error parsing userDTO:', error);
        throw new BadRequestException('Invalid JSON in userDTO. Please check the format.');
      }
        return this.terminalService.save(documentDTO, files);
    }


    @Post('import')
    @ApiOperation({ summary: 'Import players from Excel file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Excel file containing players data',
        type: FileUploadDto,
    })
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(xlsx|xls)$/)) {
                    return cb(new Error('Only Excel files are allowed!'), false);
                }
                cb(null, true);
            },
        })
    )
    async importExcel(@UploadedFile() file: Express.Multer.File) {
        return this.terminalService.importFromExcel(file);
    }


    @Get('file/:docId')
    async getFile(@Param('docId') docId: number, @Res() res: Response) {
      const document = await this.repository.findOneBy({id: docId } );
      
      if (!document) {
        throw new NotFoundException('Document not found');
      }
  
      const fullPath = join(process.cwd(), document.photo);
  
      if (!fs.existsSync(fullPath)) {
        throw new NotFoundException('File not found');
      }
  
      // Stream file to response
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.photo.split('\\').pop()}"`,
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
    @ApiOperation({ summary: "Update players data" })
    update(
      @Param("id") id: string,
      @Body() userDTO: any,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
     
      if (!userDTO.dtos) {
        throw new BadRequestException('No DTOs received. Make sure you are sending a "dtos" field.');
      }
    
      let dtos: playersDto;
      try {
        dtos = JSON.parse(userDTO.dtos);
      } catch (error) {
        console.error('Error parsing dtos:', error);
        throw new BadRequestException('Invalid JSON in dtos field. Please check the format.');
      }
       
    
      return this.terminalService.update(parseInt(id), dtos, files);
    }
    
} 



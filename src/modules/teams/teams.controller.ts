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
import { LogoDto } from "./logo.dto";
import { TeamLogoEntity } from "src/entities/teamLogo.entity";


@Controller("team")
@ApiTags("team")
export class teamController{

     constructor(
        private terminalService:teamService,
        @InjectRepository(TeamEntity) private repository: Repository<TeamEntity>,
         @InjectRepository(TeamLogoEntity) private logorepository: Repository<TeamLogoEntity>,
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

    @Post("save_logo")
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
    })async save2(@Body() body: any, 
     @UploadedFiles() files: Express.Multer.File[],) {
      let documentDTO: LogoDto[];
      try {
        documentDTO = JSON.parse(body.documentDTO);
      } catch (error) {
        console.error('Error parsing userDTO:', error);
        throw new BadRequestException('Invalid JSON in userDTO. Please check the format.');
      }
        return this.terminalService.save2(documentDTO, files);
    }

    @Get('files/:docId')
    async getFiles(@Param('docId') docId: number, @Res() res: Response) {
      const document = await this.logorepository.findOne({ where: { team_id: docId } });
  
      if (!document) {
        throw new NotFoundException('Document not found');
      }
  
      const images = document.logo.split(',').filter((img: string) => img.trim() !== '');
      
      // Check if all files exist
      for (const imagePath of images) {
        const fullPath = join(process.cwd(), imagePath);
        if (!fs.existsSync(fullPath)) {
          throw new NotFoundException(`File not found: ${imagePath}`);
        }
      }
  
      // Generate URLs for images (assuming you're serving them statically or through another route)
      const imageUrls = images.map((imagePath: string) => {
        return `${encodeURIComponent(imagePath)}`;
      });
  
      return res.json({ imageUrls });
    }

    @Get('file/preview/:filePath')
    getSingleFile(@Param('filePath') filePath: string, @Res() res: Response) {
      const decodedPath = decodeURIComponent(filePath);      
      const fullPath = join(process.cwd(), decodedPath);
  
      if (!fs.existsSync(fullPath)) {
        throw new NotFoundException(`File not found: ${filePath}`);
      }
  
      res.set({
        'Content-Type': 'image/jpeg', // or 'image/png' based on your image type
        'Content-Disposition': `inline; filename="${filePath.split('\\').pop()}"`,
      });
  
      fs.createReadStream(fullPath).pipe(res);
    }

    @Post("createzzzzzzzzzzzzzzz")
    // @UseGuards(JwtAuthGuard)
    // @Roles(Role.ADMIN)
    @ApiOperation({ summary: "save auditType" })
    save3(@Body() DTO:LogoDto) {
        return 0;
    }
    
} 



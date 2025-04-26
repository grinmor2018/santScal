import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { Candidate } from './interfaces/candidate.interface';
import { Express, Response } from 'express';
import * as ExcelJS from 'exceljs';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('excelFile'))
  async create(
    @Body() createCandidateDto: CreateCandidateDto,
    @UploadedFile() excelFile: Express.Multer.File
  ): Promise<Candidate> {
    if (!excelFile) {
      throw new BadRequestException('Excel file is required');
    }

    return this.candidatesService.createCandidate(
      createCandidateDto.name,
      createCandidateDto.surname,
      excelFile.buffer
    );
  }

  @Get()
  findAll(): Candidate[] {
    return this.candidatesService.findAll();
  }
}

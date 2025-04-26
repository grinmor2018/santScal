import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { Candidate } from './interfaces/candidate.interface';
import { Response } from 'express';
export declare class CandidatesController {
    private readonly candidatesService;
    constructor(candidatesService: CandidatesService);
    create(createCandidateDto: CreateCandidateDto, excelFile: Express.Multer.File): Promise<Candidate>;
    findAll(): Candidate[];
    downloadTemplate(res: Response): Promise<void>;
}

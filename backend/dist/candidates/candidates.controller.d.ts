import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { Candidate } from './interfaces/candidate.interface';
export declare class CandidatesController {
    private readonly candidatesService;
    constructor(candidatesService: CandidatesService);
    create(createCandidateDto: CreateCandidateDto, excelFile: Express.Multer.File): Promise<Candidate>;
    findAll(): Candidate[];
}

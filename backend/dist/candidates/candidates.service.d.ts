import { Candidate } from './interfaces/candidate.interface';
export declare class CandidatesService {
    private candidates;
    createCandidate(name: string, surname: string, excelBuffer: Buffer): Promise<Candidate>;
    private processExcelFile;
    findAll(): Candidate[];
}

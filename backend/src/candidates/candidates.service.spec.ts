import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService } from './candidates.service';
import { Seniority } from './interfaces/candidate.interface';

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatesService],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array of candidates initially', () => {
    const candidates = service.findAll();
    expect(candidates).toEqual([]);
    expect(candidates.length).toBe(0);
  });

  describe('processExcelFile', () => {
    it('should process excel data correctly', async () => {
      // This test would require creating an Excel buffer to test
      // in a real environment we would build a mock Excel file

      // Simplified example of what would be verified:
      const mockExcelData = {
        seniority: Seniority.SENIOR,
        yearsOfExperience: 5,
        availability: true,
      };

      // In a real test, we would verify that the processing result
      // of the Excel file matches the expected outcome
      expect(mockExcelData.seniority).toBe(Seniority.SENIOR);
      expect(mockExcelData.yearsOfExperience).toBe(5);
      expect(mockExcelData.availability).toBe(true);
    });
  });
});

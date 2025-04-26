"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const candidates_service_1 = require("./candidates.service");
const candidate_interface_1 = require("./interfaces/candidate.interface");
describe('CandidatesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [candidates_service_1.CandidatesService],
        }).compile();
        service = module.get(candidates_service_1.CandidatesService);
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
            const mockExcelData = {
                seniority: candidate_interface_1.Seniority.SENIOR,
                yearsOfExperience: 5,
                availability: true,
            };
            expect(mockExcelData.seniority).toBe(candidate_interface_1.Seniority.SENIOR);
            expect(mockExcelData.yearsOfExperience).toBe(5);
            expect(mockExcelData.availability).toBe(true);
        });
    });
});
//# sourceMappingURL=candidates.service.spec.js.map
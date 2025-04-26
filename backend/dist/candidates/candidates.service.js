"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatesService = void 0;
const common_1 = require("@nestjs/common");
const candidate_interface_1 = require("./interfaces/candidate.interface");
const ExcelJS = require("exceljs");
const uuid_1 = require("uuid");
let CandidatesService = class CandidatesService {
    constructor() {
        this.candidates = [];
    }
    async createCandidate(name, surname, excelBuffer) {
        try {
            const excelData = await this.processExcelFile(excelBuffer);
            const newCandidate = {
                id: (0, uuid_1.v4)(),
                name,
                surname,
                ...excelData,
            };
            this.candidates.push(newCandidate);
            return newCandidate;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : 'Invalid Excel file';
            throw new common_1.BadRequestException(msg);
        }
    }
    async processExcelFile(buffer) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('Excel file does not contain valid data');
        }
        let headerRowNum = null;
        const headerMap = {};
        for (let i = 1; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const tempMap = {};
            row.eachCell({ includeEmpty: false }, (cell, col) => {
                const text = String(cell.value || '')
                    .toLowerCase()
                    .trim();
                if (text === 'seniority')
                    tempMap['seniority'] = col;
                else if (text === 'years of experience')
                    tempMap['yearsOfExperience'] = col;
                else if (text === 'availability')
                    tempMap['availability'] = col;
            });
            if (tempMap['seniority'] &&
                tempMap['yearsOfExperience'] &&
                tempMap['availability']) {
                headerRowNum = i;
                Object.assign(headerMap, tempMap);
                break;
            }
        }
        if (!headerRowNum) {
            throw new Error('Excel file does not contain required headers');
        }
        let dataRow = null;
        for (let i = headerRowNum + 1; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const cellVal = row.getCell(headerMap['seniority']).value;
            if (cellVal !== null && cellVal !== undefined && String(cellVal).trim()) {
                dataRow = row;
                break;
            }
        }
        if (!dataRow) {
            throw new Error('Excel file does not contain data rows');
        }
        const seniorityValue = String(dataRow.getCell(headerMap['seniority']).value || '')
            .toLowerCase()
            .trim();
        const yearsOfExperienceValue = Number(dataRow.getCell(headerMap['yearsOfExperience']).value || 0);
        const rawAvailability = dataRow.getCell(headerMap['availability']).value;
        let availabilityValue;
        if (typeof rawAvailability === 'boolean') {
            availabilityValue = rawAvailability;
        }
        else {
            const text = String(rawAvailability || '')
                .toLowerCase()
                .trim();
            availabilityValue = text === 'true' || text === '1';
        }
        if (seniorityValue !== 'junior' && seniorityValue !== 'senior') {
            throw new Error(`Invalid value for 'seniority': ${seniorityValue}`);
        }
        const seniority = seniorityValue === 'junior' ? candidate_interface_1.Seniority.JUNIOR : candidate_interface_1.Seniority.SENIOR;
        return {
            seniority,
            yearsOfExperience: yearsOfExperienceValue,
            availability: availabilityValue,
        };
    }
    findAll() {
        return this.candidates;
    }
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = __decorate([
    (0, common_1.Injectable)()
], CandidatesService);
//# sourceMappingURL=candidates.service.js.map
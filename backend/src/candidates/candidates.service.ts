import { Injectable, BadRequestException } from '@nestjs/common';
import { Candidate, Seniority } from './interfaces/candidate.interface';
import * as ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CandidatesService {
  private candidates: Candidate[] = [];

  async createCandidate(
    name: string,
    surname: string,
    excelBuffer: Buffer
  ): Promise<Candidate> {
    try {
      // Process the Excel file
      const excelData = await this.processExcelFile(excelBuffer);

      // Create a new candidate
      const newCandidate: Candidate = {
        id: uuidv4(),
        name,
        surname,
        ...excelData,
      };

      // Save to the collection (in memory)
      this.candidates.push(newCandidate);

      return newCandidate;
    } catch (error) {
      // Throw a BadRequest with the specific error message
      const msg = error instanceof Error ? error.message : 'Invalid Excel file';
      throw new BadRequestException(msg);
    }
  }

  private async processExcelFile(buffer: Buffer): Promise<{
    seniority: Seniority;
    yearsOfExperience: number;
    availability: boolean;
  }> {
    // Load workbook and select the first worksheet
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('Excel file does not contain valid data');
    }

    // Dynamically find header row and map required columns
    let headerRowNum: number | null = null;
    const headerMap: Record<string, number> = {};
    for (let i = 1; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const tempMap: Record<string, number> = {};
      row.eachCell({ includeEmpty: false }, (cell, col) => {
        const text = String(cell.value || '')
          .toLowerCase()
          .trim();
        if (text === 'seniority') tempMap['seniority'] = col;
        else if (text === 'years of experience')
          tempMap['yearsOfExperience'] = col;
        else if (text === 'availability') tempMap['availability'] = col;
      });
      if (
        tempMap['seniority'] &&
        tempMap['yearsOfExperience'] &&
        tempMap['availability']
      ) {
        headerRowNum = i;
        Object.assign(headerMap, tempMap);
        break;
      }
    }
    if (!headerRowNum) {
      throw new Error('Excel file does not contain required headers');
    }

    // Locate the first data row after headers
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

    // Extract data using the mapped columns
    const seniorityValue = String(
      dataRow.getCell(headerMap['seniority']).value || ''
    )
      .toLowerCase()
      .trim();
    const yearsOfExperienceValue = Number(
      dataRow.getCell(headerMap['yearsOfExperience']).value || 0
    );
    // Parse availability: handle boolean or string/number values
    const rawAvailability = dataRow.getCell(headerMap['availability']).value;
    let availabilityValue: boolean;
    if (typeof rawAvailability === 'boolean') {
      availabilityValue = rawAvailability;
    } else {
      const text = String(rawAvailability || '')
        .toLowerCase()
        .trim();
      availabilityValue = text === 'true' || text === '1';
    }

    // Validate seniority value
    if (seniorityValue !== 'junior' && seniorityValue !== 'senior') {
      throw new Error(`Invalid value for 'seniority': ${seniorityValue}`);
    }
    const seniority =
      seniorityValue === 'junior' ? Seniority.JUNIOR : Seniority.SENIOR;

    return {
      seniority,
      yearsOfExperience: yearsOfExperienceValue,
      availability: availabilityValue,
    };
  }

  findAll(): Candidate[] {
    return this.candidates;
  }
}

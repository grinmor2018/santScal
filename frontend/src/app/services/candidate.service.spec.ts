import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CandidateService } from './candidate.service';
import { Candidate, Seniority } from '../models/candidate.model';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CandidateService', () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;
  let snackBarSpy: { open: jest.Mock };

  beforeEach(() => {
    snackBarSpy = { open: jest.fn() };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CandidateService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });
    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCandidates should return initial empty array', (done) => {
    service.getCandidates().subscribe((candidates) => {
      expect(candidates).toEqual([]);
      done();
    });
  });

  describe('uploadCandidate', () => {
    it('should post formData and update candidatesSubject', (done) => {
      const formData = new FormData();
      const mockCandidate: Candidate = {
        id: '1',
        name: 'John',
        surname: 'Doe',
        seniority: Seniority.SENIOR,
        yearsOfExperience: 5,
        availability: true,
      };

      service.uploadCandidate(formData).subscribe((candidate) => {
        expect(candidate).toEqual(mockCandidate);
        service.getCandidates().subscribe((list) => {
          expect(list).toEqual([mockCandidate]);
          done();
        });
      });

      const req = httpMock.expectOne('http://localhost:3000/candidates');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(formData);
      req.flush(mockCandidate);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CandidateService } from '../../services/candidate.service';
import { CandidateFormComponent } from './candidate-form.component';
import { Seniority } from '../../models/candidate.model';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;
  let candidateServiceMock: jasmine.SpyObj<CandidateService>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    candidateServiceMock = jasmine.createSpyObj('CandidateService', [
      'uploadCandidate',
    ]);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        CandidateFormComponent,
      ],
      providers: [
        { provide: CandidateService, useValue: candidateServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    });

    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.candidateForm.get('name')?.value).toBe('');
    expect(component.candidateForm.get('surname')?.value).toBe('');
    expect(component.selectedFile).toBeNull();
  });

  it('should mark form as invalid if fields are empty', () => {
    component.candidateForm.setValue({
      name: '',
      surname: '',
    });
    expect(component.candidateForm.valid).toBeFalsy();
  });

  it('should mark form as valid if required fields are filled', () => {
    component.candidateForm.setValue({
      name: 'Juan',
      surname: 'Pérez',
    });
    expect(component.candidateForm.valid).toBeTruthy();
  });

  it('should show file required error when no file is selected', () => {
    component.candidateForm.setValue({
      name: 'Juan',
      surname: 'Pérez',
    });

    component.onSubmit();

    expect(component.fileRequired).toBeTruthy();
    expect(candidateServiceMock.uploadCandidate).not.toHaveBeenCalled();
  });

  it('should call uploadCandidate when form is valid and file is selected', () => {
    const mockFile = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    component.candidateForm.setValue({
      name: 'Juan',
      surname: 'Pérez',
    });
    component.selectedFile = mockFile;

    candidateServiceMock.uploadCandidate.and.returnValue(
      of({
        id: '1',
        name: 'Juan',
        surname: 'Pérez',
        seniority: Seniority.SENIOR,
        yearsOfExperience: 5,
        availability: true,
      })
    );

    component.onSubmit();

    expect(candidateServiceMock.uploadCandidate).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Candidate registered successfully',
      'Close',
      { duration: 3000 }
    );
  });

  it('should show error message when uploadCandidate fails', () => {
    const mockFile = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    component.candidateForm.setValue({
      name: 'Juan',
      surname: 'Pérez',
    });
    component.selectedFile = mockFile;

    candidateServiceMock.uploadCandidate.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.onSubmit();

    expect(candidateServiceMock.uploadCandidate).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Error registering candidate',
      'Close',
      { duration: 3000 }
    );
    expect(component.loading).toBeFalsy();
  });
});

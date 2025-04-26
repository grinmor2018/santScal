import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CandidateService } from '../../services/candidate.service';
import { CandidateFormComponent } from './candidate-form.component';
import { Seniority } from '../../models/candidate.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;
  let candidateServiceMock: any;
  let snackBarMock: any;

  beforeEach(() => {
    candidateServiceMock = {
      uploadCandidate: jest.fn(),
    };
    snackBarMock = { open: jest.fn() };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      declarations: [CandidateFormComponent],
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

    candidateServiceMock.uploadCandidate.mockReturnValue(
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
      { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center' }
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

    candidateServiceMock.uploadCandidate.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.onSubmit();

    expect(candidateServiceMock.uploadCandidate).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith('Error', 'Close', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    expect(component.loading).toBeFalsy();
  });
});

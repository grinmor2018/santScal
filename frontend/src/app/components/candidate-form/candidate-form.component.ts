import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss'],
})
export class CandidateFormComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  candidateForm: FormGroup;
  selectedFile: File | null = null;
  fileRequired = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private snackBar: MatSnackBar
  ) {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.fileRequired = false;
    }
  }

  onSubmit(): void {
    // First ensure a file is selected
    if (!this.selectedFile) {
      this.fileRequired = true;
      return;
    }
    this.fileRequired = false;
    // Then validate name and surname fields
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.candidateForm.get('name')?.value);
    formData.append('surname', this.candidateForm.get('surname')?.value);
    formData.append('excelFile', this.selectedFile);

    this.candidateService.uploadCandidate(formData).subscribe({
      next: (response) => {
        this.snackBar.open('Candidate registered successfully', 'CERRAR', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.resetForm();
      },
      error: (error) => {
        console.error('Error registering candidate', error);
        // Extract backend error message if available
        const errMsg =
          error?.error?.message ||
          error?.message ||
          'Error registering candidate';
        this.snackBar.open(errMsg, 'CERRAR', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.loading = false;
      },
    });
  }

  private resetForm(): void {
    this.candidateForm.reset();
    this.candidateForm.markAsPristine();
    this.candidateForm.markAsUntouched();
    Object.values(this.candidateForm.controls).forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
      // Remove any validation errors to reset the input appearance
      control.setErrors(null);
    });
    this.selectedFile = null;
    // Clear the file input element so the same file can be selected again
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
    this.fileRequired = false;
    this.loading = false;
  }
}


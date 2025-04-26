import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates';
  private candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  candidates$ = this.candidatesSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Get the current list of candidates
  getCandidates(): Observable<Candidate[]> {
    return this.candidates$;
  }

  // Upload the form with the Excel file for processing
  uploadCandidate(formData: FormData): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, formData).pipe(
      tap((newCandidate) => {
        const currentCandidates = this.candidatesSubject.value;
        this.candidatesSubject.next([...currentCandidates, newCandidate]);
      })
    );
  }
}


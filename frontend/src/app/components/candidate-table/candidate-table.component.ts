import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-candidate-table',
  templateUrl: './candidate-table.component.html',
  styleUrls: ['./candidate-table.component.scss'],
})
export class CandidateTableComponent implements OnInit {
  candidates: Candidate[] = [];
  displayedColumns: string[] = [
    'name',
    'surname',
    'seniority',
    'yearsOfExperience',
    'availability',
  ];

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.candidateService.getCandidates().subscribe((candidates) => {
      this.candidates = candidates;
    });
  }
}

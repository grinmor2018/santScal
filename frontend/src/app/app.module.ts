import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { CandidateFormModule } from './components/candidate-form/candidate-form.module';
import { CandidateTableModule } from './components/candidate-table/candidate-table.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    MatToolbarModule,
    CandidateFormModule,
    CandidateTableModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

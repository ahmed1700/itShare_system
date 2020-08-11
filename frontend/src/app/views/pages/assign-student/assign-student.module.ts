import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AssigStudentListComponent } from './assig-student-list/assig-student-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FetchEntityDialogComponent } from '../../partials/content/crud';
import { PartialsModule } from '../../partials/partials.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,  
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';



const routes: Routes = [
  {
		path: '',
		component: AssigStudentListComponent
  },
  
]



@NgModule({
  declarations: [AssigStudentListComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PartialsModule,
    RouterModule.forChild(routes),
    CommonModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatNativeDateModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    LayoutUtilsService
  ],
  entryComponents: [ FetchEntityDialogComponent,
  ],
})
export class AssignStudentModule { }

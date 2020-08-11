import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FetchEntityDialogComponent } from '../../partials/content/crud';
import { PartialsModule } from '../../partials/partials.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
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

import { ActionNotificationComponent } from '../../partials/content/crud';
import { TrainerReceivablesComponent } from './trainer-receivables/trainer-receivables.component';
import { TrainerPayComponent } from './trainer-pay/trainer-pay.component';


const routes: Routes = [
  {
		path: '',
		component: TrainerReceivablesComponent
  },
  
]


@NgModule({
  declarations: [TrainerReceivablesComponent, TrainerPayComponent],
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
    MatTooltipModule,
    NgxMaterialTimepickerModule,
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
  entryComponents: [ FetchEntityDialogComponent,TrainerPayComponent,ActionNotificationComponent
  ],
})
export class TrainerReceivablesModule { }
 
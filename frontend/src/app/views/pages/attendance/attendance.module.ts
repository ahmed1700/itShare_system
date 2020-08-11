import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceDetailsComponent } from './attendance-details/attendance-details.component';
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
import { EditAttendantComponent } from './edit-attendant/edit-attendant.component';




const routes: Routes = [
  {
		path: '',
		component: AttendanceDetailsComponent
  },
  
]
@NgModule({
  declarations: [AttendanceDetailsComponent, EditAttendantComponent],
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
  entryComponents: [ FetchEntityDialogComponent,EditAttendantComponent,ActionNotificationComponent,
  ],
})
export class AttendanceModule { }

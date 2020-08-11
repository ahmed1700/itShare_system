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
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferEditComponent } from './transfer-edit/transfer-edit.component';


const routes: Routes = [
  {
		path: '',
		component: TransferListComponent
  },
  
]
@NgModule({
  declarations: [TransferListComponent,TransferEditComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PartialsModule,
    RouterModule.forChild(routes),
    CommonModule,
    NgxMaterialTimepickerModule,
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
  entryComponents: [ FetchEntityDialogComponent,ActionNotificationComponent,TransferEditComponent
  ],
})
export class TransferModule { }

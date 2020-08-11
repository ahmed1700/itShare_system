import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomFormsModule } from 'ng2-validation'
import { AlternativeAttendantListComponent } from './alternative-attendant-list/alternative-attendant-list.component';
import { AlternativeAttendantEditComponent } from './alternative-attendant-edit/alternative-attendant-edit.component';
import { FetchEntityDialogComponent } from '../../partials/content/crud';

// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
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
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';
import {AlertComponentModule} from '../alert-component/alert-component.module';
import {AlertComponentComponent} from '../alert-component/alert-component/alert-component.component';
import { ActionNotificationComponent } from '../../partials/content/crud';
const routes: Routes = [
  

  {
    path: '',
    component: AlternativeAttendantListComponent,
  },
  {
    path: 'add',
    component: AlternativeAttendantEditComponent
  },
 
  {
    path: 'edit/:id',
    component: AlternativeAttendantEditComponent
  },

];
@NgModule({
  declarations: [AlternativeAttendantListComponent, AlternativeAttendantEditComponent],
  imports: [
    CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		TranslateModule,
		PartialsModule,
		CustomFormsModule,
		NgxMaterialTimepickerModule,
		AlertComponentModule,
		//angular material
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
    {
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			},
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		FetchEntityDialogComponent,
		AlertComponentComponent,
		ActionNotificationComponent
	],
})
export class AlternativeAttendantModule { }

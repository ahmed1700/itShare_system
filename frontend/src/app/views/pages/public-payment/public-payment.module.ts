import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 

// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
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
import { FetchEntityDialogComponent } from '../../partials/content/crud';
import {AlertComponentModule} from '../alert-component/alert-component.module'
import { AlertComponentComponent } from '../alert-component/alert-component/alert-component.component';
import { ActionNotificationComponent } from '../../partials/content/crud';
import { PublicPaymentListComponent } from './public-payment-list/public-payment-list.component';
import { PublicPaymentEditComponent } from './public-payment-edit/public-payment-edit.component';
import { PublicPaymentPdfComponent } from './public-payment-pdf/public-payment-pdf.component';
import { ShowDetailsComponent } from './show-details/show-details.component';

const routes: Routes = [
  {
		path: 'publicPayment',
		component: PublicPaymentListComponent
	},
	{
		path: 'add',
		component: PublicPaymentEditComponent
	},

	{
		path: 'edit/:id',
		component: PublicPaymentEditComponent
	},
	{
		path: '',
		component: PublicPaymentListComponent
	},
]

@NgModule({
  declarations: [PublicPaymentListComponent, PublicPaymentEditComponent, PublicPaymentPdfComponent, ShowDetailsComponent],
  imports: [
    CommonModule,AlertComponentModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		TranslateModule,
		PartialsModule,
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
    ActionNotificationComponent,
		PublicPaymentPdfComponent,
		ShowDetailsComponent
	],
})
export class PublicPaymentModule { }

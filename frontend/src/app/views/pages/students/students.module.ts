import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomFormsModule } from 'ng2-validation' 
    //component
import { StudentsListComponent } from './students-list/students-list.component';
import { StudentsEditComponent } from './students-edit/students-edit.component';
import { FetchEntityDialogComponent } from '../../partials/content/crud';
import { AssignStudentComponent } from './assign-student-to-course-form/assign-student.component';
import { StudentPaymentComponent } from './student-payment-form/student-payment.component';
import {AlertComponentModule} from '../alert-component/alert-component.module';
import {AlertComponentComponent} from '../alert-component/alert-component/alert-component.component';
import { ActionNotificationComponent } from '../../partials/content/crud';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
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
import { StudentInvoiceComponent } from './student-last-invoice/student-invoice.component';
import { StudentPaymentListComponent } from './student-assign-courses-list/student-payment-list.component';
import { StudentAllPaymentsComponent } from './student-all-payments-list/student-all-payments.component';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { InvoiceEveryPaymentComponent } from './invoice-every-payment/invoice-every-payment.component';
import { StudentExamComponent } from './student-assign-exam-list/student-exam.component';
import { AssignExamComponent } from './assign-student-to-exam-form/assign-exam.component';
import { ExamInvoiceComponent } from './exam-invoice/exam-invoice.component';
import { StudentAttendantComponent } from './student-attendant/student-attendant.component';


const routes: Routes = [

			{
				path: 'students',
				component: StudentsListComponent
      },
      {
				path: '',
				component: StudentsListComponent,
			},
			{
				path: 'add',
				component: StudentsEditComponent
			},
			{
				path: 'add:id',
				component: StudentsEditComponent
			},
			{
				path: 'edit',
				component: StudentsEditComponent
			},
			{
				path: 'edit/:id',
				component: StudentsEditComponent
			},
			{
				path: 'assign',
				component: StudentPaymentListComponent
			},
			{
				path: 'assign/:id',
				component: StudentPaymentListComponent
			},
			{
				path: 'payments',
				component: StudentAllPaymentsComponent
			},
			{
				path: 'payments/:id',
				component: StudentAllPaymentsComponent
			},
			{
				path: 'exam/:id',
				component: StudentExamComponent
			},
		
];


@NgModule({
  declarations: [StudentsListComponent, StudentsEditComponent, AssignStudentComponent, StudentPaymentComponent,StudentInvoiceComponent, StudentPaymentListComponent, StudentAllPaymentsComponent, TransferHistoryComponent, InvoiceEveryPaymentComponent, StudentExamComponent, AssignExamComponent, ExamInvoiceComponent, StudentAttendantComponent],
  imports: [
    CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		TranslateModule,
		PartialsModule,
		CustomFormsModule,
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
		ActionNotificationComponent,
		StudentInvoiceComponent,
		StudentPaymentComponent,
		AssignStudentComponent,
		InvoiceEveryPaymentComponent,
		TransferHistoryComponent,
		AssignExamComponent,
		ExamInvoiceComponent,
		StudentAttendantComponent
	],
})
export class StudentsModule { }

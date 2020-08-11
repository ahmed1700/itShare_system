import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomFormsModule } from 'ng2-validation'
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
import { ActionNotificationComponent } from '../../partials/content/crud';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { ProviderEditComponent } from './provider-edit/provider-edit.component';
import {AlertComponentModule} from '../alert-component/alert-component.module';
import { AlertComponentComponent } from './../alert-component/alert-component/alert-component.component';
const routes: Routes = [

	{
		path: 'add',
		component: ProviderEditComponent
	},
	{
		path: 'edit/:id',
		component: ProviderEditComponent
	},
	{
		path: '',
		component: ProvidersListComponent
	},

];


@NgModule({
  declarations: [ProvidersListComponent, ProviderEditComponent],
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
   ActionNotificationComponent
 ],
})
export class ProvidersModule { }

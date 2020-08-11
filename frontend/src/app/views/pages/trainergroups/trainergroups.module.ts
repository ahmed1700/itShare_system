import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomFormsModule } from 'ng2-validation'
import { ActionNotificationComponent } from '../../partials/content/crud';
import { FetchEntityDialogComponent } from '../../partials/content/crud';
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
  MatTooltipModule,
  MatToolbarModule
} from '@angular/material';

import { AlertComponentComponent } from './alert-component/alert-component.component';
import { TrainergroupsDetailsComponent } from './trainergroups-details/trainergroups-details.component';
import { TrainerSignINComponent } from './trainer-sign-in/trainer-sign-in.component';
import { TrainerSignOUTComponent } from './trainer-sign-out/trainer-sign-out.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
//calender
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TrainerPaymentComponent } from './trainer-payment/trainer-payment.component';
import { TodaysAttendantComponent } from './todays-attendant/todays-attendant.component';
import { NavComponentComponent } from './nav-component/nav-component.component';
import { TrainerCalenderComponent } from './trainer-calender/trainer-calender.component';
import { StudentAttendComponent } from './student-attend/student-attend.component';
const routes: Routes = [
  {
    path: '',
    component: NavComponentComponent, children:[
      { path: '',component: TodaysAttendantComponent},
      { path: 'calender',component: TrainerCalenderComponent},
      { path: 'view/:id',component: TrainergroupsDetailsComponent},
    ]
  },
  
  
] 



@NgModule({
  declarations: [ AlertComponentComponent, TrainergroupsDetailsComponent, TrainerSignINComponent, TrainerSignOUTComponent, ChangePassComponent, TrainerPaymentComponent, TodaysAttendantComponent, NavComponentComponent, TrainerCalenderComponent, StudentAttendComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    PartialsModule,
    CustomFormsModule,
    //calender
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
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
    MatTooltipModule,
    MatToolbarModule
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
    ActionNotificationComponent,
    AlertComponentComponent,
    TrainergroupsDetailsComponent,
    TrainerSignINComponent,
    TrainerSignOUTComponent,
    ChangePassComponent,
    TrainerPaymentComponent,
    StudentAttendComponent
    
  ]


})
export class TrainergroupsModule { }

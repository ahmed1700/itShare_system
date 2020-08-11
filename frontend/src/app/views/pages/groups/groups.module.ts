import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomFormsModule } from 'ng2-validation'
import { GroupListComponent } from './group-list/group-list.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { ActionNotificationComponent } from '../../partials/content/crud';
import { FetchEntityDialogComponent } from '../../partials/content/crud';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker'; 

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
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
import { GroupDetailsComponent } from './group-details/group-details.component';
import {AlertComponentModule} from '../alert-component/alert-component.module'
import { AlertComponentComponent } from '../alert-component/alert-component/alert-component.component';
import { GroupsCalenderComponent } from './groups-calender/groups-calender.component';
import {
  CalendarDateFormatter, 
  DateFormatterParams,
  CalendarNativeDateFormatter,
} from 'angular-calendar';


class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date, locale }: DateFormatterParams): string {
      return new Intl.DateTimeFormat('eg', {
          hour: 'numeric',
          minute: 'numeric'
      }).format(date);
  }
  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat('eg', {
        hour: 'numeric',
        minute: 'numeric'
    }).format(date);
}
}
const routes: Routes = [
  
  {
    path: 'calender',
    component: GroupsCalenderComponent
  },
  {
    path: '',
    component: GroupListComponent,
  },
  {
    path: 'add',
    component: GroupEditComponent
  },
 
  {
    path: 'edit/:id',
    component: GroupEditComponent
  }, 
  
  {
    path: 'view/:id',
    component: GroupDetailsComponent
  },
]



@NgModule({
  declarations: [GroupListComponent, GroupEditComponent, GroupDetailsComponent, GroupsCalenderComponent],

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
    MatTooltipModule,
    NgxMaterialTimepickerModule,
    NgbModalModule,
    
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }, {
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass: CustomDateFormatter
      }
    })
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
    GroupDetailsComponent
  ]


})
export class GroupsModule { }

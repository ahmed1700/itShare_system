import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import {  Observable, Subscription } from 'rxjs';
//validation
import { CustomValidators } from 'ng2-validation';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';

import { vacation } from '../../../../core/auth/_models/vacations.model';

// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog } from '@angular/material';
import { VacationsService } from '../../../../core/auth/_services/vacations.service';

@Component({
  selector: 'kt-vacation-edit',
  templateUrl: './vacation-edit.component.html'
})
export class VacationEditComponent implements OnInit, OnDestroy {
  vacation: vacation;
  vacationId$: Observable<number>;
  oldvacation: vacation;
  selectedTab: number = 0;
  loading$: Observable<boolean>;
  vacationForm: FormGroup;
  hasFormErrors: boolean = false;
  errorMessage: string = '';
  // Private properties
  private subscriptions: Subscription[] = [];



  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vacationFb: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private vacationsService: VacationsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private layoutConfigService: LayoutConfigService

  ) { }

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id && id > 0) {

        const addSubscription = this.vacationsService.getVacationByID(id).subscribe(res => {
          if (res.result == true) {
            this.vacation = res.data[0];
            console.log(this.vacation)
            this.oldvacation = Object.assign({}, this.vacation);
            this.initVacation()

          }
        });
        this.subscriptions.push(addSubscription);
      } else {
        this.vacation = new vacation();
        this.vacation.clear();
        this.oldvacation = Object.assign({}, this.vacation);
        this.initVacation();
      }
    });
    this.subscriptions.push(routeSubscription);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  initVacation() {
    this.createForm();
    if (!this.vacation.vacationID) {
      this.subheaderService.setTitle('Create Vacation');
      this.subheaderService.setBreadcrumbs([
        { title: 'Vacations', page: `vacations` },
        { title: 'Create Vacation', page: `vacations/add` }
      ]);
      return;
    }
    this.subheaderService.setTitle('Edit Vacation');
    this.subheaderService.setBreadcrumbs([
      { title: 'Vacations', page: `vacations` },
      { title: 'Edit vacation', page: `vacations/edit`, queryParams: { id: this.vacation.vacationID } }
    ]);
  }
  createForm() {
    this.vacationForm = this.vacationFb.group({
      title: [this.vacation.title, [Validators.required]],
      date: [this.vacation.date, Validators.required]

    });
  }



  /**
   * Redirect to list
   *
   */
  goBackWithId() {
    const url = `/vacations`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  /**
   * Refresh Student
   *
   * @param isNew: boolean
   * @param id: number
   */
  refreshTrainer(isNew: boolean = false, id = 0) {
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
      return;
    }

    url = `/vacations/edit/${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  /**
   * Reset
   */
  reset() {
    this.vacation = Object.assign({}, this.oldvacation);
    this.createForm();
    this.hasFormErrors = false;
    this.vacationForm.markAsPristine();
    this.vacationForm.markAsUntouched();
    this.vacationForm.updateValueAndValidity();
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSumbit(withBack: boolean = false) {
    if (this.selectedTab == 0) {
      this.hasFormErrors = false;
      const controls = this.vacationForm.controls;
      /** check form */
      if (this.vacationForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );

        this.hasFormErrors = true;
        this.errorMessage = 'Please check invalid fields'
        this.selectedTab = 0;
        return;
      }

      const editedVacation = this.prepareTrainer();
      delete editedVacation.vacationID;
      delete editedVacation.indexDay;
      console.log(editedVacation);
      if (this.oldvacation.vacationID > 0) {
        this.updateVacation(editedVacation, withBack);
        return;
      }

      this.addVacation(editedVacation, withBack);
    }

  }

  /**
   * Returns prepared data for save
   */
  prepareTrainer(): vacation {
    const controls = this.vacationForm.controls;
    const _vacation = new vacation();
    _vacation.clear();
    _vacation.title = controls['title'].value;
    _vacation.date = controls['date'].value;
    return _vacation;
  }


  updateVacation(_vacation: vacation, withBack: boolean = false) {
    //Check if nothing changed

    if (
      _vacation.title == this.oldvacation.title &&
      _vacation.date == this.oldvacation.date
    ) {
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Vacation', 'message': 'There are no changes, Are you sure you want to exit?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          this.layoutUtilsService.showActionNotification('no changes')
          this.router.navigateByUrl('/vacations')
        }
      });

    } else {
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Vacation', 'message': 'There are something changed, Are you sure you want to update vacation data?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          const addSubscription = this.vacationsService.updateVacation(this.oldvacation.vacationID, _vacation).subscribe(res => {
            if (res.result == true) {
              this.layoutUtilsService.showActionNotification('vacation has been succefully saved');
              this.router.navigateByUrl('/vacations')
            } else {
              this.errorMessage = res.message;
              this.cdr.detectChanges()
            }

            this.subscriptions.push(addSubscription);
          },
            error => {
              console.log(error)
              this.errorMessage = error.error || error.statusText;
              this.cdr.detectChanges()

            })

        }
      });
    }
  }


  addVacation(_vacation: vacation, withBack: boolean = false) {
    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Add Vacation', 'message': ' Are you sure you want to add Vacation?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        const addSubscription = this.vacationsService.addNewVacation(_vacation).subscribe(res => {
          if (res.result == true) {
            this.layoutUtilsService.showActionNotification('Vacations has been succefully saved');
            this.router.navigateByUrl('/vacations')
          } else {
            this.errorMessage = res.message;
            this.cdr.detectChanges()
          }

          this.subscriptions.push(addSubscription);
        },
          error => {
            this.errorMessage = error.error || error.statusText;
            this.cdr.detectChanges()
          })
      }
    });
  }

  /**
   * Returns component title
   */
  getComponentTitle() {
    let result = 'Create Vacation';
    if (!this.vacation || !this.vacation.vacationID) {
      return result;
    }

    result = `Edit Vacation - ${this.vacation.title}`;
    return result;
  }

  /**
   * Close Alert
   *
   * @param $event: Event
   */
  onAlertClose($event) {
    this.errorMessage = '';
  }

}

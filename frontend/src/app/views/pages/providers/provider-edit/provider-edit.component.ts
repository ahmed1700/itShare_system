import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subscription } from 'rxjs';


// Layout
import { SubheaderService} from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';
//student
import { ProvidersService } from '../../../../core/auth/_services/providers.service';
import { provider } from '../../../../core/auth/_models/providers.models';
//branches


// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog } from '@angular/material';

@Component({
  selector: 'kt-provider-edit',
  templateUrl: './provider-edit.component.html'
})
export class ProviderEditComponent implements OnInit, OnDestroy {
  provider: provider;
  trainerId$: Observable<number>;
  oldProvider: provider;
  selectedTab: number = 0;
  providerForm: FormGroup;
  hasFormErrors: boolean = false;
  errorMessage: string = '';
  // Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private providerFb: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private providersService: ProvidersService,

    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    
  ) { }


  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id && id > 0) {
        const addSubscription = this.providersService.getProviderByID(id).subscribe(res => {
          console.log(res)
          if (res.result == true) {
            this.provider = res.data;
            this.oldProvider = Object.assign({}, this.provider);
            this.initProvider();
            this.cdr.detectChanges()

          } else {
            this.errorMessage = res.message;
            this.cdr.detectChanges()
          }
        }, error => {
          this.errorMessage = error.error;
          this.cdr.detectChanges()
        });
        this.subscriptions.push(addSubscription);
      } else {
        this.provider = new provider();
        this.provider.clear();
        this.oldProvider = Object.assign({}, this.provider);
        this.initProvider();
      }
    });
    this.subscriptions.push(routeSubscription);
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  initProvider() {
    this.createForm();
    if (!this.provider.providerID) {
      this.subheaderService.setTitle('Create Provider');
      this.subheaderService.setBreadcrumbs([
        { title: 'Providers', page: `providers` },
        { title: 'Create Provider', page: `providers/add` }
      ]);
      return;
    }
    this.subheaderService.setTitle('Edit Provider');
    this.subheaderService.setBreadcrumbs([
      { title: 'Providers', page: `providers` },
      { title: 'Edit Provider', page: `providers/edit`, queryParams: { id: this.provider.providerID } }
    ]);
  }

  /**
   * Create form
   */
  createForm() {
    this.providerForm = this.providerFb.group({
      providerName: [this.provider.providerName, Validators.required],
      providerDesc: [this.provider.providerDesc, Validators.required],
    
    });
  }



  /**
   * Redirect to list
   *
   */
  goBackWithId() {
    const url = `/providers`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  /**
   * Refresh Student
   *
   * @param isNew: boolean
   * @param id: number
   */
  refreshProvider(isNew: boolean = false, id = 0) {
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
      return;
    }

    url = `/providers/edit/${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  /**
   * Reset
   */
  reset() {
    this.provider = Object.assign({}, this.oldProvider);
    this.createForm();
    this.hasFormErrors = false;
    this.providerForm.markAsPristine();
    this.providerForm.markAsUntouched();
    this.providerForm.updateValueAndValidity();
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSumbit(withBack: boolean = false) {
    if (this.selectedTab == 0) {
      this.hasFormErrors = false;
      const controls = this.providerForm.controls;
      /** check form */
      if (this.providerForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );

        this.hasFormErrors = true;
        this.errorMessage = 'Please check invalid fields'
        return;
      }

      const editedProvider = this.prepareTrainer();
      delete editedProvider.providerID;
      if (this.oldProvider.providerID > 0) {
        this.updateProvider(editedProvider, withBack);
        return;
      }

      this.addProvider(editedProvider, withBack);
    }

  }

  /**
   * Returns prepared data for save
   */
  prepareTrainer(): provider {
    const controls = this.providerForm.controls;
    const _provider = new provider();
    _provider.clear();
    _provider.providerDesc = controls['providerDesc'].value;
    _provider.providerName = controls['providerName'].value;
    _provider.employeeID = JSON.parse(localStorage.getItem('currentUser')).employeeID;

    return _provider;
  } 


  updateProvider(_provider: provider, withBack: boolean = false) {
    //Check if nothing changed

    if (
      _provider.providerName == this.oldProvider.providerName &&
      _provider.employeeID == this.oldProvider.employeeID &&
      _provider.providerDesc == this.oldProvider.providerDesc

    ) {
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Provider', 'message': 'There are no changes, Are you sure you want to exit?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          this.layoutUtilsService.showActionNotification('no changes')
          this.router.navigateByUrl('/providers')
        }
      });

    } else {
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Provider', 'message': 'There are something changed, Are you sure you want to update Provider data?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          const addSubscription = this.providersService.updateProvider(this.oldProvider.providerID, _provider).subscribe(res => {
            if (res.result == true) {
              this.layoutUtilsService.showActionNotification('Provider has been succefully saved');
              this.router.navigateByUrl('/providers')
              this.subscriptions.push(addSubscription);
            } else {
              this.errorMessage = res.message;
              this.cdr.detectChanges()
            }

          },
            error => {
              this.errorMessage = error.error
              this.cdr.detectChanges()

            })

        }
      });
    }
  }


  addProvider(_provider: provider, withBack: boolean = false) {
    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Add Provider', 'message': ' Are you sure you want to add Provider?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        const addSubscription = this.providersService.addNewProvider(_provider).subscribe(res => {
          if (res.result == true) {
            this.layoutUtilsService.showActionNotification('Provider has been succefully saved');
            this.router.navigateByUrl('/providers')
            this.subscriptions.push(addSubscription);
          } else {
            this.errorMessage = res.message
            this.cdr.detectChanges()
          }

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
    let result = 'Create Provider';
    if (!this.provider || !this.provider.providerID) {
      return result;
    }

    result = `Edit Provider - ${this.provider.providerName}`;
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

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, of, Subscription } from 'rxjs';

//validation 
import { CustomValidators } from 'ng2-validation';
// Layout
import { SubheaderService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';

//Exams
import { Exams } from '../../../../core/auth/_models/exams.model';
import { examsService } from '../../../../core/auth/_services/exams.service';

import { ProvidersService } from '../../../../core/auth/_services/providers.service';
import { provider } from '../../../../core/auth/_models/providers.models';

// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog } from '@angular/material';

@Component({
	selector: 'kt-exams-edit',
	templateUrl: './exams-edit.component.html',
	styleUrls: ['./exams-edit.component.scss']
})
export class ExamsEditComponent implements OnInit {

	// Public properties
	Exams: Exams;
	oldExams: Exams;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
    allproviders: provider[];
	ExamsForm: FormGroup;
	hasFormErrors: boolean = false;
	errorMessage: string = '';
	paymentTypes = ['Cash', 'Visa', 'Fawry', 'BankTransfar', 'VodaphonCash', 'PayPal'];
	// Private properties
	private subscriptions: Subscription[] = [];

	// validation properties
	numberNotAllowedRegx = /^([^0-9]*)$/;
	specialCharsNotAllowed = /^[^+!@#$_%,.`-]*$/;
	numbersOnly = "^[0-9]*$";
   orignalPrice

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param ExamsFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private ExamsFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private ExamsService: examsService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
		private providersService: ProvidersService,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];

			if (id && id > 0) {
				let Exams = this.ExamsService.getExamByID(id).subscribe(res => {
					if (res.result == true) {
						this.Exams = res.data;
						this.oldExams = Object.assign({}, this.Exams);
						this.initExams();
						this.getAllProviders();
						this.cdr.detectChanges()

					}
					this.subscriptions.push(Exams)
				});

			} else {
				this.Exams = new Exams();
				this.oldExams = Object.assign({}, this.Exams);
				this.getAllProviders();
				this.initExams();

			}
		});

		this.subscriptions.push(routeSubscription)
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	getAllProviders() {
		const addSubscription = this.providersService.getProviders().subscribe(res => {
		  if (res.result == true) {
			this.allproviders = res.data;
			this.cdr.detectChanges()
		  }
	
		})
		this.subscriptions.push(addSubscription);
	  }

	/**
	 * Init Exams
	 */
	initExams() {
		this.createForm();
		if (!this.Exams.examID) {
			this.subheaderService.setTitle('Create Exams');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Exams', page: `Examss` },
				{ title: 'Examss', page: `Examss` },
				{ title: 'Create Exams', page: `Examss/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Exams');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Exams ', page: `Examss` },
			{ title: 'Examss', page: `Examss` },
			{ title: 'Edit Exams', page: `Examss/edit`, queryParams: { id: this.Exams.examID } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.ExamsForm = this.ExamsFB.group({
			name: [this.Exams.examName, [Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed), Validators.minLength(3)]],
			providerID: [this.Exams.providerID, [Validators.required]],
			totalPrice: [this.Exams.examPrice, [Validators.pattern(this.numbersOnly),Validators.required]],
			code: [this.Exams.examCode, Validators.required],
      examCurrentPrice : [this.Exams.examCurrentPrice, [Validators.pattern(this.numbersOnly),Validators.required]],
      
		});
	}



	//get branch name



	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/Examss`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh Exams
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshExams(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/Examss/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.Exams = Object.assign({}, this.oldExams);
		this.createForm();
		this.hasFormErrors = false;
		this.ExamsForm.markAsPristine();
		this.ExamsForm.markAsUntouched();
		this.ExamsForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		if (this.selectedTab == 0) {
			this.hasFormErrors = false;
			const controls = this.ExamsForm.controls;
			/** check form */
			if (this.ExamsForm.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);

				this.hasFormErrors = true;
				this.errorMessage = 'Please check invalid fields'
				this.selectedTab = 0;
				return;
			}

			const editedExams = this.prepareExams();
			delete editedExams.examID;
			if (this.oldExams.examID > 0) {
				this.updateExams(editedExams, withBack);
				return;
			}

			this.addExams(editedExams, withBack);
		}


	}

	/**
	 * Returns prepared data for save
	 */
	prepareExams(): Exams {
		const controls = this.ExamsForm.controls;
		const _Exams = new Exams();
		_Exams.examName = controls['name'].value;
		_Exams.providerID = controls['providerID'].value;
		_Exams.examPrice = controls['totalPrice'].value;
		_Exams.employeeID = JSON.parse(localStorage.getItem('currentUser')).employeeID;
		_Exams.examCode = controls['code'].value;
		_Exams.examCurrentPrice = controls['examCurrentPrice'].value;
		delete _Exams.examID
		return _Exams;
	}

	/**
	 * Add Exams
	 *
	 * @param _Exams: Exams
	 * @param withBack: boolean
	 */
	updateExams(_Exams: Exams, withBack: boolean = false) {
		//Check if nothing changed


		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Update Exams', 'message': 'There are something changed, Are you sure you want to update user data?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				const updateExamss = this.ExamsService.updateExam(this.Exams.examID, _Exams).subscribe(res => {
					if (res.result == true) {
						this.layoutUtilsService.showActionNotification('Exams has been succefully saved');
						this.router.navigateByUrl('/exams')
						this.cdr.detectChanges();
					} else {
						this.errorMessage = res.message;
						this.cdr.detectChanges()
					}

				},
					error => {
						this.errorMessage = error.error;
						this.cdr.detectChanges()

					})
				this.subscriptions.push(updateExamss)

			}
		});

	}

	/**
	 * Update Exams
	 *
	 * @param _Exams: Exams
	 * @param withBack: boolean
	 */
	addExams(_Exams: Exams, withBack: boolean = false) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add Exams', 'message': ' Are you sure you want to add Exams?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.ExamsService.addNewExam(_Exams).subscribe(res => {
					if (res.result == true) {
						this.layoutUtilsService.showActionNotification('Exams has been succefully saved');
						this.router.navigateByUrl('/exams')
						this.cdr.detectChanges();
					} else {
						this.errorMessage = res.message;
						this.cdr.detectChanges();
					}
				},
					error => {
						this.errorMessage = error.error;
						this.cdr.detectChanges()
					})
			}
		});
	}



	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Create Exams';
		if (!this.Exams || !this.Exams.examID) {
			return result;
		}

		result = `Edit Exams - ${this.Exams.examName}`;
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

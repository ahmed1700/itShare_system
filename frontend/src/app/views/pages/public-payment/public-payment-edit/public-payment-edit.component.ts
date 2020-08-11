import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// RxJS
import { Observable, Subscription } from 'rxjs';

import { LayoutUtilsService } from '../../../../core/_base/crud';

import { PublicPayment } from '../../../../core/auth/_models/public-payment.model';
import { publicPaymentService } from '../../../../core/auth/_services/publicPayment.service';
// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog } from '@angular/material';

//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';

@Component({
	selector: 'kt-public-payment-edit',
	templateUrl: './public-payment-edit.component.html',
	styleUrls: ['./public-payment-edit.component.scss']
})
export class PublicPaymentEditComponent implements OnInit {

	// Public properties
	PublicPayment: PublicPayment;
	oldPublicPayment: PublicPayment;
	selectedTab: number = 0;
	loading$: Observable<boolean>;

	PublicPaymentForm: FormGroup;
	hasFormErrors: boolean = false;
	errorMessage: string = '';
	tranactionTypes = ['In', 'Out'];
	totalPay
	// Private properties
	private subscriptions: Subscription[] = [];

	// validation properties
	numberNotAllowedRegx = /^([^0-9]*)$/;
	specialCharsNotAllowed = /^[^+!@#$_%,.`-]*$/;
	numbersOnly = "^[0-9]*$";
	isAdmin: boolean = false;
	allBranches: Branch[];
	allCategories: [{ 'categoryID': number, 'categoryName': string }]

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param PublicPaymentFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private PublicPaymentFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private PublicPaymentService: publicPaymentService,
		private branchesService: branchesService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
			this.getAllBranches();
		}
		this.PublicPayment = new PublicPayment();
		this.oldPublicPayment = Object.assign({}, this.PublicPayment);
		this.getAllCategory()
		this.createForm();

	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Init PublicPayment
	 */

	/**
	 * Create form
	 */
	createForm() {
		this.PublicPaymentForm = this.PublicPaymentFB.group({
			branchID: [this.PublicPayment.branchID,],
			paid: [this.PublicPayment.paid, [Validators.pattern(this.numbersOnly)]],
			categoryID: [this.PublicPayment.categoryID, Validators.required],
			tranactionType: [this.PublicPayment.tranactionType, Validators.required],
			categoryDetails: this.PublicPaymentFB.array([]),

		});
	}

	getAllBranches() {
		let branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
				this.cdr.detectChanges()
			}
		})
		this.subscriptions.push(branches)
	}

	getAllCategory() {
		this.PublicPaymentService.getAllCategoryName().subscribe(res => {
			if (res.result == true) {
				this.allCategories = res.data
				this.cdr.detectChanges()
			}
		})
	}



	goBackWithId() {
		const url = `/publicPayments`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh PublicPayment
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */

	/**
	 * Reset
	 */
	reset() {
		this.PublicPayment = Object.assign({}, this.oldPublicPayment);
		this.createForm();
		this.hasFormErrors = false;
		this.PublicPaymentForm.markAsPristine();
		this.PublicPaymentForm.markAsUntouched();
		this.PublicPaymentForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		if (this.selectedTab == 0) {
			this.hasFormErrors = false;
			const controls = this.PublicPaymentForm.controls;
			/** check form */
			if (this.PublicPaymentForm.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);

				this.hasFormErrors = true;
				this.errorMessage = 'Please check invalid fields'
				this.selectedTab = 0;
				return;
			}

			const editedPublicPayment = this.preparePublicPayment();
			delete editedPublicPayment.publicPaymentID;

			this.addPublicPayment(editedPublicPayment, withBack);
		}


	}

	/**
	 * Returns prepared data for save
	 */
	preparePublicPayment(): PublicPayment {
		const controls = this.PublicPaymentForm.controls;
		const _PublicPayment = new PublicPayment();
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			_PublicPayment.branchID = controls['branchID'].value;
		} else {
			_PublicPayment['branchID'] = JSON.parse(localStorage.getItem('currentUser')).branchID;
		}

		_PublicPayment.paid = controls['paid'].value;
		_PublicPayment.tranactionType = controls['tranactionType'].value;
		_PublicPayment.employeeID = JSON.parse(localStorage.getItem('currentUser')).employeeID;
		if (controls['categoryDetails'].value && controls['categoryDetails'].value.length > 0) {
			_PublicPayment.categoryDetails = controls['categoryDetails'].value;
		} else {
			delete _PublicPayment.categoryDetails
		}
		_PublicPayment.categoryID = controls['categoryID'].value;


		return _PublicPayment;
	}

	/**
	 * Add PublicPayment
	 *
	 * @param _PublicPayment: PublicPayment
	 * @param withBack: boolean
	 */

	/**
	 * Update PublicPayment
	 *
	 * @param _PublicPayment: PublicPayment
	 * @param withBack: boolean
	 */
	addPublicPayment(_PublicPayment: PublicPayment, withBack: boolean = false) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add PublicPayment', 'message': ' Are you sure you want to add PublicPayment?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.PublicPaymentService.addNewpublicPayment(_PublicPayment).subscribe(res => {
					if (res.result == true) {
						this.layoutUtilsService.showActionNotification('PublicPayment has been succefully saved');
						this.router.navigateByUrl('/publicPayment')
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




	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.errorMessage = '';
	}

	getCategoryDetails(): FormGroup {

		return this.PublicPaymentFB.group({
			name: [''],
			price: ['', [Validators.pattern(this.numbersOnly)]],
			Quantity: ['']

		})

	}
	addNewCategoryDetails() {
		(this.PublicPaymentForm.get('categoryDetails') as FormArray).push(this.getCategoryDetails());
	}

	addItem(): void {

		(this.PublicPaymentForm.get('categoryDetails') as FormArray).push(this.getCategoryDetails());


	}

	deleteControl(control, index) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add Group', 'message': 'Are you sure you want to delete this row?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				(this.PublicPaymentForm.get('categoryDetails') as FormArray).removeAt(index);
				this.cdr.detectChanges()
			}

		});

		// control.removeAt(index)
	}

	showControls() {
		console.log('hghghghgghghghghgghghgghg', this.PublicPaymentForm.controls)
		let categoryDetails = this.PublicPaymentForm.controls['categoryDetails'].value
		if (categoryDetails.length > 0) {
			let pay = categoryDetails.map(i => i.Quantity * i.price)
			console.log(pay)
			var sum = pay.reduce(function (a, b) {
				return a + b;

			}, 0);
			this.totalPay = sum;
			this.PublicPaymentForm.controls['paid'].setValue(this.totalPay)
		}
	}


}

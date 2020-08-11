import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subscription } from 'rxjs';
// validation
import { CustomValidators } from 'ng2-validation';
// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';
//service
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';
//angular material
import { MatDialog } from '@angular/material';

@Component({
	selector: 'kt-branche-edit',
	templateUrl: './branche-edit.component.html',

})
export class BrancheEditComponent implements OnInit, OnDestroy {
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	Branch: Branch;
	BranchId$: Observable<number>;
	oldBranch: Branch;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	branchForm: FormGroup;
	hasFormErrors: boolean = false;
	errorMessage: string = '';
	// Private properties
	private subscriptions: Subscription[] = [];

	// validation properties
	numberNotAllowedRegx = /^([^0-9]*)$/;
	specialCharsNotAllowed = /^[^+!@#$_%,.`-]*$/;
	numbersOnly = "^[0-9]*$";
	IPAddressregx = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private branchFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private branchesService: branchesService,
		public dialog: MatDialog, private cdr: ChangeDetectorRef) {

	}

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				const addSubscription = this.branchesService.getBranchtByID(id).subscribe(res => {
					if (res.result == true) {
						this.Branch = res.data;
						this.oldBranch = Object.assign({}, this.Branch);
						this.initBranch();
					}

				});
				this.subscriptions.push(addSubscription);
			} else {
				this.Branch = new Branch();
				this.Branch.clear();
				this.oldBranch = Object.assign({}, this.Branch);
				this.initBranch();
			}
		});
		this.subscriptions.push(routeSubscription);
	}
	/**
		 * Init user
		 */
	initBranch() {
		this.createForm();
		if (!this.Branch.branchID) {
			this.subheaderService.setTitle('Create Branch');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Branches', page: `branches` },
				{ title: 'Create branch', page: `add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Branch');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Branches', page: `branches` },
			{ title: 'Edit branch', page: `edit`, queryParams: { id: this.Branch.branchID } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.branchForm = this.branchFB.group({
			name: [this.Branch.name, [Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed)]],
			address: [this.Branch.address, Validators.required],
			homeTel2: [this.Branch.homeTel2, [Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([10, 10])]],
			homeTel1: [this.Branch.homeTel1, [Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([10, 10])]],
			details: [this.Branch.details, Validators.required],
			ip: [this.Branch.ip, [Validators.required, Validators.pattern(this.IPAddressregx)]],
			ip2: [this.Branch.ip2, [Validators.required, Validators.pattern(this.IPAddressregx)]],
			ip3: [this.Branch.ip3, [Validators.required, Validators.pattern(this.IPAddressregx)]],
			mobile1: [this.Branch.mobile1, [Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]],
			mobile2: [this.Branch.mobile2, [Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]],
			email: [this.Branch.email, [Validators.required, CustomValidators.email]],
		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/branches`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshBranches(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `branches/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.Branch = Object.assign({}, this.oldBranch);
		this.createForm();
		this.hasFormErrors = false;
		this.branchForm.markAsPristine();
		this.branchForm.markAsUntouched();
		this.branchForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = true) {
		this.hasFormErrors = false;
		const controls = this.branchForm.controls;
		/** check form */
		if (this.branchForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.errorMessage = 'Please check invalid fields'
			return;
		}

		const editedBranch = this.prepareBranch();

		delete editedBranch.branchID;
		if (this.oldBranch.branchID > 0) {
			this.updatebranch(editedBranch, withBack);
			return;
		}

		this.addbranch(editedBranch, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareBranch(): Branch {
		const controls = this.branchForm.controls;
		const _branch = new Branch();
		_branch.clear();
		_branch.branchID = this.Branch.branchID;
		_branch.name = controls['name'].value;
		_branch.ip = controls['ip'].value;
		_branch.ip2 = controls['ip2'].value;
		_branch.ip3 = controls['ip3'].value;
		_branch.details = controls['details'].value;
		_branch.homeTel1 = controls['homeTel1'].value;
		_branch.homeTel2 = controls['homeTel2'].value;
		_branch.mobile1 = controls['mobile1'].value;
		_branch.mobile2 = controls['mobile2'].value;
		_branch.email = controls['email'].value;
		_branch.address = controls['address'].value;
		return _branch;
	}



	updatebranch(_branch: Branch, withBack: boolean = false) {
		//Check if nothing changed

		if (
			_branch.name == this.oldBranch.name &&
			_branch.ip == this.oldBranch.ip &&
			_branch.ip2 == this.oldBranch.ip2 &&
			_branch.ip3 == this.oldBranch.ip3 &&
			_branch.address == this.oldBranch.address &&
			_branch.details == this.oldBranch.details &&
			_branch.mobile2 == this.oldBranch.mobile2 &&
			_branch.mobile1 == this.oldBranch.mobile1 &&
			_branch.email == this.oldBranch.email &&
			_branch.homeTel1 == this.oldBranch.homeTel1 &&
			_branch.homeTel2 == this.oldBranch.homeTel2

		) {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update Branch', 'message': 'There are no changes, Are you sure you want to exit?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.layoutUtilsService.showActionNotification('no changes')
					this.router.navigateByUrl('/branches');
				}
			});

		} else {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update Branch', 'message': 'There are something changed, Are you sure you want to update Branch data?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					const addSubscription = this.branchesService.updateBranch(this.oldBranch.branchID, _branch).subscribe(res => {
						if (res.result == true) {
							this.layoutUtilsService.showActionNotification('Branch has been succefully saved');
							this.router.navigateByUrl('/branches');
						} else {
							this.errorMessage = res.message;
							this.cdr.detectChanges();
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


	addbranch(_branch: Branch, withBack: boolean = false) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add branch', 'message': ' Are you sure you want to add branch?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				const addSubscription = this.branchesService.addNewBranch(_branch).subscribe(res => {
					if (res.result == true) {
						this.layoutUtilsService.showActionNotification('Branch has been succefully saved');
						this.router.navigateByUrl('/branches');
					} else {
						this.errorMessage = res.message
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

	getComponentTitle() {
		let result = 'Create Branch';
		if (!this.Branch || !this.Branch.branchID) {
			return result;
		}

		result = `Edit Branch - ${this.Branch.name}`;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
		this.errorMessage = ''
	}
}

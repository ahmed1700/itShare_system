// Angular
import { Component, OnInit, Input, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


// Assign student
import { AssignStudentService } from '../../../../core/auth/_services/assignStudent.service';
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';


// Course 
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';
///payments
import { Payment } from '../../../../core/auth/_models/payment.model';
import { PaymentsService } from '../../../../core/auth/_services/payment.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//groups
import { GroupsService } from '../../../../core/auth/_services/group.service';


//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';

@Component({
	selector: 'kt-student-payment',
	templateUrl: './student-payment.component.html',
})
export class StudentPaymentComponent implements OnInit {

	// Public properties
	// Incoming data

	errormessage = '';
	hasFormErrors: boolean = false;
	paymentForm: FormGroup;
	Payment: Payment;
	studentID;
	paymentTypes = ['Cash', 'Visa', 'Fawry', 'BankTransfar', 'VodaphonCash', 'PayPal'];
	coursesList = [];
	groupList = [];
	assignCoureses: AssignStudent[];
	TotalPayment;
	paid;
	remaining;
	assignStudentID;
	allBranches: Branch[];
	isAdmin: boolean = false;
    loading=false;


	/**
	 * Component Costructor 
	 *
	 * @param fb: FormBuilder
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(private fb: FormBuilder,
		private AssignStudentService: AssignStudentService,
		private CoursesService: CoursesService,
		public dialog: MatDialog,
		private cdr: ChangeDetectorRef,
		public dialogRef: MatDialogRef<StudentPaymentComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private PaymentsService: PaymentsService,
		private GroupsService: GroupsService,
		private branchesService: branchesService,
		private layoutUtilsService: LayoutUtilsService,
		private Router: Router
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.dialogRef.disableClose = true;
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
			this.getAllBranches();
		}
		this.studentID = this.data;
		this.AssignStudentService.getAssinStudent(this.studentID).subscribe(res => {
			if (res.result == true) {
				this.assignCoureses = res.data;
				for (let i = 0; i < res.data.length; i++) {
					this.CoursesService.getCourseByID(res.data[i].courseID).subscribe(res => {
						if (res.result == true) {
							this.coursesList.push(res.data);
							this.cdr.detectChanges()
						}
					})
				}
			}
		})
		this.createForm();
	}

	// Validators.pattern("^[0-9]*$")
	/**
	 * Init form
	 */
	createForm() {
		this.paymentForm = this.fb.group({
			paymentType: ['', Validators.required],
			paid: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
			courseID: ['', Validators.required],
			groupID: [''],
			branchID: [''],
			comment: ['']
		});

	}

	getAllBranches() {
		let branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
				this.cdr.detectChanges()
			}
		})
	}

	onSubmit(transActionType) {
		this.hasFormErrors = false;
		this.loading=true;
		const controls = this.paymentForm.controls;
		/** check form */
		if (this.paymentForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()

			);
			this.errormessage = 'Oh snap! Check your data please.';
			this.hasFormErrors = true;
			return;
		} else {
			let payment = this.preparePayment();
			if (transActionType == 'pay') {
				payment['tranactionType'] = 'in';
				const dialogRef = this.dialog.open(AlertComponentComponent, {
					width: '40%',
					data: { 'title': 'Pay', 'message': 'Are you sure you want to pay?' },
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					} else {
						this.loading=false;
						this.PaymentsService.addNewPayment(payment).subscribe(res => {
							if (res.result == true) {
								this.dialogRef.close({ res })
							} else {
								this.errormessage = res.message;
							}
						})
					}
				});

			} else {
				payment['tranactionType'] = 'out';
				if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin') {
					const dialogRef = this.dialog.open(AlertComponentComponent, {
						width: '40%',
						data: { 'title': 'Refund', 'message': 'Are you sure you want to refund?' },
					});
					dialogRef.afterClosed().subscribe(res => {
						if (!res) {
							return;
						} else {
							this.loading=false;
							this.PaymentsService.managerRefund(payment).subscribe(res => {
								if (res.result == true) {	
									this.dialogRef.close({ res })
								} else {
									this.errormessage = res.message;
								}
							})
						}
					});
				} else {
					const dialogRef = this.dialog.open(AlertComponentComponent, {
						width: '40%',
						data: { 'title': 'Refund', 'message': 'Are you sure you want to refund?' },
					});
					dialogRef.afterClosed().subscribe(res => {
						if (!res) {
							return;
						} else {
							this.loading=false;
							this.PaymentsService.addNewPayment(payment).subscribe(res => {
								if (res.result == true) {	
									this.dialogRef.close({ res })
								} else {
									this.errormessage = res.message;
								}
							})
						}
					});
				}

			}

		}
	}



	// لما يختار كورس معين عايزاه يجيب التراكات بتاعته

	preparePayment() {
		const controls = this.paymentForm.controls;
		const newPayment = new Payment();
		newPayment.clear();
		newPayment['employeeID'] = JSON.parse(localStorage.getItem('currentUser')).employeeID;
		newPayment['paymentType'] = controls['paymentType'].value;
		newPayment['paid'] = controls['paid'].value;
		newPayment['studentID'] = this.studentID;
		newPayment['courseID'] = controls['courseID'].value;
		newPayment['assignStudentID'] = this.assignStudentID;
		if (controls['comment'].value) {
			newPayment['comment'] = controls['comment'].value
		} else {
			delete newPayment.comment
		}
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			newPayment['branchID'] = controls['branchID'].value
		} else {
			newPayment['branchID'] = JSON.parse(localStorage.getItem('currentUser')).branchID;
		}

		delete newPayment.paymentID
		delete newPayment.creationDate
		return newPayment

	}

	onNoClick() {
		this.dialogRef.close();
	}

	findPayment() {
		this.TotalPayment = 0;
		this.remaining = 0;
		this.groupList = [];
		let courseID = this.paymentForm.controls['courseID'].value;
		let assignStudent = this.assignCoureses.filter(student => student.courseID === courseID);
		if (assignStudent.length == 1) {
			this.assignStudentID = assignStudent[0].assignStudentID
			this.TotalPayment = assignStudent[0].totalPayment;
			this.PaymentsService.findRemaining(assignStudent[0].assignStudentID).subscribe(res => {
				this.remaining = res.remaingPayment
			}) 
		}
		if (assignStudent.length > 1) {
			for (let i = 0; i < this.assignCoureses.length; i++) {
				if (this.assignCoureses[i].groupID&&this.assignCoureses[i].courseID==courseID) {
					this.GroupsService.getGroupByID(this.assignCoureses[i].groupID).subscribe(res => {
						if (res.result == true) {
							let group = res.group			
								this.groupList.push(group)
						}
					})
				} 
			}
		}

	}


	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.errormessage = '';
	}
	findPaymentByGroup() {
		this.groupList = [];
		let courseID = this.paymentForm.controls['courseID'].value;
		let groupID = this.paymentForm.controls['groupID'].value;
		if (this.paymentForm.controls['groupID'].value == 0) {
			let assignStudent = this.assignCoureses.find(student => (student.courseID === courseID && !student.groupID));
			this.assignStudentID = assignStudent.assignStudentID
			this.TotalPayment = assignStudent.totalPayment;
			this.PaymentsService.findRemaining(assignStudent.assignStudentID).subscribe(res => {
				this.remaining = res.remaingPayment
			})
		} else {
			let assignStudent = this.assignCoureses.find(student => (student.courseID === courseID && student.groupID === groupID))
			this.assignStudentID = assignStudent.assignStudentID
			this.TotalPayment = assignStudent.totalPayment;
			this.PaymentsService.findRemaining(assignStudent.assignStudentID).subscribe(res => {
				this.remaining = res.remaingPayment
			})
		}
	}

}

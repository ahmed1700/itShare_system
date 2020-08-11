// Angular
import { Component, OnInit, Input, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutUtilsService } from '../../../../core/_base/crud';
//Exams
import {Exams} from '../../../../core/auth/_models/exams.model';
import {ExamStudent} from '../../../../core/auth/_models/student_exam.model';
import {examsService} from '../../../../core/auth/_services/exams.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component';

//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';


@Component({
  selector: 'kt-assign-exam',
  templateUrl: './assign-exam.component.html',
  styleUrls: ['./assign-exam.component.scss'] 
})
export class AssignExamComponent implements OnInit {

  // Public properties
	// Incoming data

	errormessage = '';
	hasFormErrors: boolean = false;
	ExamStudentForm: FormGroup;
	ExamStudent: ExamStudent;
	studentID;
	paymentTypes = ['Cash', 'Visa', 'Fawry', 'BankTransfar', 'VodaphonCash', 'PayPal'];
	allExams:Exams []
	assignStudentID;
	orignalPrice
	isAdmin: boolean = false;
	allBranches: Branch[];




	/**
	 * Component Costructor 
	 *
	 * @param fb: FormBuilder
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(private fb: FormBuilder,
		public dialog: MatDialog,
		private cdr: ChangeDetectorRef,
		public dialogRef: MatDialogRef<AssignExamComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private examService: examsService,
		private branchesService:branchesService,
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
		this.studentID = this.data.studentID;
	  this.allExams=this.data.exams
		this.createForm();
	}

	getAllBranches() {
		let branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
				this.cdr.detectChanges()
			}
		})
	}

	// Validators.pattern("^[0-9]*$")
	/**
	 * Init form
	 */
	createForm() {
		this.ExamStudentForm = this.fb.group({
      examID: ['', Validators.required],
			totalPrice: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      code: ['', Validators.required],
			paymentType: ['', Validators.required],
			branchID: [''],
		});

	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.ExamStudentForm.controls;
		/** check form */
		if (this.ExamStudentForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()

			);
			this.errormessage = 'Oh snap! Check your data please.';
			this.hasFormErrors = true;
			return;
		} else {
			let ExamStudent = this.prepareExamStudent();
		
				const dialogRef = this.dialog.open(AlertComponentComponent, {
					width: '40%',
					data: { 'title': 'Assign To Exam', 'message': 'Are you sure you want to assign student?' },
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					} else {
						this.examService.addNewAssignExam(ExamStudent).subscribe(res => {
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
	changeExam(){
		let exam = this.allExams.find(item=>item.examID===this.ExamStudentForm.controls['examID'].value)
		 this.ExamStudentForm.controls['totalPrice'].setValue(exam.examCurrentPrice)
		 this.orignalPrice=exam.examPrice

	}


	// لما يختار كورس معين عايزاه يجيب التراكات بتاعته

	prepareExamStudent() {
		const controls = this.ExamStudentForm.controls;
		const newExamStudent = new ExamStudent();

		newExamStudent['employeeID'] = JSON.parse(localStorage.getItem('currentUser')).employeeID ;
		newExamStudent['examID'] = controls['examID'].value;
		newExamStudent['code'] = controls['code'].value;
		newExamStudent['studentID'] = this.studentID;
		newExamStudent['totalPrice'] = controls['totalPrice'].value;
		newExamStudent['originalPrice'] = this.orignalPrice;
    newExamStudent['paymentType'] = controls['paymentType'].value;
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			newExamStudent['branchID'] = controls['branchID'].value
		} else {
			newExamStudent['branchID'] = JSON.parse(localStorage.getItem('currentUser')).branchID;
		}
		delete newExamStudent.studentExamID
		return newExamStudent
	}

	onNoClick() {
		this.dialogRef.close();
	}

	
	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.errormessage = '';
	}
	

}

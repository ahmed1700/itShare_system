// Angular
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { TransferService } from '../../../../core/auth/_services/transfer'

// Assign student
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';
import { AssignStudentService } from '../../../../core/auth/_services/assignStudent.service';

//courses
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

//tracks
import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';

//groups

import { GroupsService } from '../../../../core/auth/_services/group.service';
import { Group } from '../../../../core/auth/_models/group.model';

import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component';


@Component({
	selector: 'kt-assign-student',
	templateUrl: './assign-student.component.html',
})
export class AssignStudentComponent implements OnInit, OnDestroy {


	errormessage = '';
	hasFormErrors: boolean = false;
	assignForm: FormGroup;
	assignStudent: AssignStudent;
	courses: Course[];
	tracks: Track[] = [];
	track: Track;
	courseTracks = [];
	groups: Group[] = [];
	studentID;
	TotalPayment = 0;
	priceAfterDiscound;
	allTracks: Track[];
	canTransfer;

	private subscriptions: Subscription[] = [];


	/**
	 * Component Costructor 
	 *
	 * @param fb: FormBuilder
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(private fb: FormBuilder,
		public dialogRef: MatDialogRef<AssignStudentComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private AssignStudentService: AssignStudentService,
		private CoursesService: CoursesService,
		private TracksService: TracksService,
		private GroupsService: GroupsService,
		public dialog: MatDialog,
		private TransferService: TransferService,
		private cdr: ChangeDetectorRef) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.dialogRef.disableClose = true; // امنع انه يتقفل لما اضغط بره الديالوج
		this.assignStudent = this.data.student;
		if (this.assignStudent.assignStudentID) {
			this.canTransfer = true
		}
		console.log(this.assignStudent)
		//ده بيانات الطالب المسجل اللي جايبها من الكومبوننت
		if (this.assignStudent.courseTracks && this.assignStudent.courseTracks.length > 0) {
			this.CoursesService.getCourseByID(this.assignStudent.courseID).subscribe(res => {
				if (res.result == true) {
					this.allTracks = res.tracks;
					for (let i = 0; i <= this.allTracks.length - 1; i++) {
						this.tracks.push(this.allTracks[i])
					}

					for (let i = 0; i <= this.assignStudent.courseTracks.length - 1; i++) {
						let track = this.allTracks.find(Track => Track.trackID === this.assignStudent.courseTracks[i].trackID);
						this.courseTracks.push(track.trackID);

					}

					this.cdr.detectChanges();

				}
			})
		}
		if (this.assignStudent.totalPayment) {
			this.TotalPayment = this.assignStudent.totalPayment
		}

		//  بجيب كل الجروبات علشان يختار منها 
		let groups = this.GroupsService.getWorkingAndPendingGroups().subscribe(data => {
			if (data.result == true) {
				this.groups = data.data;
			}

		})

		// بجيب كل الكورسات علشان يختار منها
		let courses = this.CoursesService.getCoursesName().subscribe(res => {
			if (res.result == true) {
				this.courses = res.data;
			}
		});



		this.createForm();
		this.subscriptions.push(groups, courses)
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}


	// Validators.pattern("^[0-9]*$")
	/**
	 * Init form
	 */
	createForm() {
		this.assignForm = this.fb.group({
			groupID: [this.assignStudent.groupID],
			courseID: [this.assignStudent.courseID, Validators.required],
			courseTracks: [this.courseTracks],
			totalPayment: [this.assignStudent.totalPayment, [Validators.pattern("^[0-9]*$"), Validators.required]],
			comment: ['']
		});

	}


	// لما يختار كورس معين عايزاه يجيب التراكات بتاعته
	changeTracks(courseID) {
		this.courseTracks = []
		this.tracks = [];
		this.assignForm.controls['courseTracks'].reset([])
		this.assignForm.controls['courseID'].value;
		if (this.courses) {
			const courses = this.courses.find(course => course.courseID === courseID);
			this.CoursesService.getCourseTracks(courseID).subscribe(res => {
				if (res.result == true) {
					this.allTracks = res.tracks;
					this.cdr.markForCheck();
					if (courses.courseTracks.length > 0 && this.allTracks) {
						for (let i = 0; i < courses.courseTracks.length; i++) {
							const track = this.allTracks.find(tracks => tracks.trackID === courses.courseTracks[i].trackID);
							this.tracks.push(track);
							this.TotalPayment = this.priceAfterDiscound = courses.priceAfterDiscount;
							this.assignForm.controls['totalPayment'].setValue(this.TotalPayment)
							this.cdr.detectChanges();
						}
					} else {

						this.TotalPayment = this.priceAfterDiscound = courses.priceAfterDiscount;
						this.assignForm.controls['totalPayment'].setValue(this.TotalPayment)

					}
				}
			})
			//this.allTracks = courses.trackDetails;

		}
	}

	changePayments(tracks) {

		let courseTracks = []
		let track

		if (tracks.length == this.tracks.length || tracks.length == 0) {
			if (!this.priceAfterDiscound) {
				this.CoursesService.getCourseByID(this.assignStudent.courseID).subscribe(res => {
					if (res.result == true) {
						this.TotalPayment = res.data.priceAfterDiscount
					}
				})
	 		} else {
				this.TotalPayment = this.priceAfterDiscound;
			}

			this.assignForm.controls['totalPayment'].setValue(this.TotalPayment)
		} else {
			for (let i = 0; i <= tracks.length - 1; i++) {

				track = this.allTracks.find(Track => Track.trackID === tracks[i]);
				courseTracks.push(track);
				this.TotalPayment = courseTracks.reduce((a, b) => +a + +b.price, 0);
				this.assignForm.controls['totalPayment'].setValue(this.TotalPayment)
			}

		}
	}

	updateAssignStudent() {
		const controls = this.assignForm.controls;
		/** check form */
		this.errormessage = '';
		const newAssignStudent = new AssignStudent();
		newAssignStudent.clear();

		newAssignStudent['employeeID'] = JSON.parse(localStorage.getItem('currentUser')).employeeID;
		if (controls['groupID'].value == 0 || !controls['groupID'].value) {
			delete newAssignStudent.groupID;
		} else {
			newAssignStudent['groupID'] = controls['groupID'].value;
		}

		newAssignStudent['courseID'] = controls['courseID'].value;
		newAssignStudent['branchID'] = JSON.parse(localStorage.getItem('currentUser')).branchID;
		if (controls['courseTracks'].value.length > 0) {
			newAssignStudent['courseTracks'] = []
			for (let i = 0; i < controls['courseTracks'].value.length; i++) {
				newAssignStudent['courseTracks'].push({ 'trackID': controls['courseTracks'].value[i] })
				console.log(newAssignStudent['courseTracks'])
			}
		} else if (this.tracks.length == 0) {
			delete newAssignStudent.courseTracks
		} if (controls['courseTracks'].value.length == 0) {
			let track = [];
			for (let i = 0; i < this.tracks.length; i++) {
				track.push({ 'trackID': this.tracks[i].trackID })
			}
			newAssignStudent['courseTracks'] = track
			console.log(newAssignStudent['courseTracks'])
		}
		if (controls['totalPayment'].value == 0 || controls['totalPayment'].value == null) {
			newAssignStudent['totalPayment'] = this.TotalPayment;
		} else {
			newAssignStudent['totalPayment'] = controls['totalPayment'].value;
		}
		newAssignStudent['studentID'] = this.data.studentID;

		delete newAssignStudent.creationDate
		delete newAssignStudent.status


		return newAssignStudent

	}

	onSubmit() {
		this.hasFormErrors = false;

		const controls = this.assignForm.controls;
		/** check form */
		if (this.assignForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()

			);
			this.errormessage = 'Oh snap! Check your data please.';
			this.hasFormErrors = true;
			document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

			return;
		} else {
			let assignStudent = this.updateAssignStudent();

			if (this.assignStudent.totalPayment) {

				const dialogRef = this.dialog.open(AlertComponentComponent, {
					width: '40%',
					data: { 'title': 'Update Assign', 'message': ' Are you sure you want to update assign student?' },
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					} else {

						this.AssignStudentService.updateStudent(this.data.student.assignStudentID, assignStudent).subscribe(res => {
							if (res.result == true) {


								this.dialogRef.close({ res })
								this.cdr.detectChanges();
							}
							else {
								this.errormessage = res.message
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

							}

						},
							error => {
								this.errormessage = error.error;
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

								this.cdr.detectChanges()
							})
					}

				});


			} else {

				const dialogRef = this.dialog.open(AlertComponentComponent, {
					width: '40%',
					data: { 'title': 'Assign Student', 'message': ' Are you sure you want to assign student?' },
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					} else {

						this.AssignStudentService.assignNewStudent(assignStudent).subscribe(res => {
							if (res.result == true) {

								this.dialogRef.close({ res })
								this.cdr.detectChanges();
							}
							else {
								this.errormessage = res.message
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

							}

						},
							error => {
								this.errormessage = error.error;
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

								this.cdr.detectChanges()
							})
					}
				});
			}
		}
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

	prepareTransfer() {
		const controls = this.assignForm.controls;
		/** check form */
		this.errormessage = '';
		let newTransfer = {};
		newTransfer['employeeID'] = JSON.parse(localStorage.getItem('currentUser')).employeeID;
		newTransfer['branchID'] = JSON.parse(localStorage.getItem('currentUser')).branchID;
		if (controls['groupID'].value != 0 && controls['groupID'].value != null) {
			newTransfer['groupID'] = controls['groupID'].value;
		}

		newTransfer['newCourseID'] = controls['courseID'].value;
		newTransfer['oldCourseID'] = this.assignStudent.courseID;
		newTransfer['assignStudentID'] = this.assignStudent.assignStudentID;
		newTransfer['newTotalPayment'] = controls['totalPayment'].value;
		if (this.assignForm.controls['courseTracks']) {
			newTransfer['courseTracks'] = [];
			for (let i = 0; i < this.assignForm.controls['courseTracks'].value.length; i++) {
				newTransfer['courseTracks'].push({ 'trackID': this.assignForm.controls['courseTracks'].value[i] })
			}

		}
		if (controls['comment'].value) {
			newTransfer['comment'] = controls['comment'].value;
		}


		return newTransfer
	}

	transfer() {
		let transfer = this.prepareTransfer();
		if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin') {
			if (this.assignStudent.assignStudentID == this.assignForm.controls['courseID'].value) {
				this.errormessage = 'Please make update';
				return;

			} else {
				const dialogRef = this.dialog.open(AlertComponentComponent, {
					width: '40%',
					data: { 'title': 'Transfer', 'message': ' Are you sure you want to transfer payment?' },
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					} else {

						this.TransferService.ManagerPostNewTansfer(transfer).subscribe(res => {
							if (res.result == true) {

								this.dialogRef.close({ res })
								this.cdr.detectChanges();
							}
							else {
								this.errormessage = res.message
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

							}

						},
							error => {
								this.errormessage = error.error;
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

								this.cdr.detectChanges()
							})
					}
				});
			}
		} else {
			if (this.assignStudent.assignStudentID == this.assignForm.controls['courseID'].value) {
				this.errormessage = 'Please make update';
				return;

			} else {
				const dialogRef = this.dialog.open(AlertComponentComponent, {
					width: '40%',
					data: { 'title': 'Transfer', 'message': ' Are you sure you want to transfer payment?' },
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					} else {

						this.TransferService.postNewTansfer(transfer).subscribe(res => {
							if (res.result == true) {

								this.dialogRef.close({ res })
								this.cdr.detectChanges();
							}
							else {
								this.errormessage = res.message
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });

							}

						},
							error => {
								this.errormessage = error.error;
								document.querySelector('#alert').scrollIntoView({ behavior: 'smooth', block: 'center' });
								this.cdr.detectChanges()
							})
					}
				});
			}
		}

	}
}

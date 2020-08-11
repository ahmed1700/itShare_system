  //Angular
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
	//rxjs
import { Subscription, Observable } from 'rxjs';
	//angular material
import { MatDialog } from '@angular/material';

  //services
import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';

import { AlternativeAttendantService } from '../../../../core/auth/_services/alternative-attendant.service';
import { AlternativeAttendant } from '../../../../core/auth/_models/alternativeAttendant.model';

import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';

// Course
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

import { GroupsService } from '../../../../core/auth/_services/group.service';

import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component';
import { SubheaderService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';



@Component({
	selector: 'kt-alternative-attendant-edit',
	templateUrl: './alternative-attendant-edit.component.html',
})

export class AlternativeAttendantEditComponent implements OnInit, OnDestroy {
	hasFormErrors: boolean = false;
	errorMessage: string = '';
	selectedTab: number = 0;

	allGroups: any[];
	allTracks: Track[]=[];
	allTrainers;
	groupName: string;
	trackName: string;
	trainerName: string;
	AlternativeformGroup: FormGroup;
	alternativeAttendance: AlternativeAttendant;
	oldAttendanceAlternative: AlternativeAttendant;
	subscription: Subscription[] = [];
	class=['lab1','lab2','lab3','lab4','lab5','lab6','lab7']

	groupCourse;
	groupTracks;
	constructor(private AlternativeSRV: AlternativeAttendantService,
		private trackSRV: TracksService,
		private trainSRV: TrainersService,
		private groupSRV: GroupsService,
		private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private cdr: ChangeDetectorRef,
		private router: Router,
		private CoursesService: CoursesService
	) { }

	ngOnInit() {

		const routeSubscription = this.activatedRoute.params.subscribe(p => {
			const id = p['id'];
			if (id && id > 0) {
				this.AlternativeSRV.GetAlternativeAttendByID(id).subscribe(res => {
					if (res.result == true) {
						this.alternativeAttendance = res.data;
						this.oldAttendanceAlternative = Object.assign({}, this.alternativeAttendance);
						this.GetAllGroups();
						this.initAlternativeAttendant();
						this.changeGroup();
						this.changeTrack();
					}
				});
			}
			else {
				// add new record.
				this.GetAllGroups();
				this.alternativeAttendance = new AlternativeAttendant();
				this.alternativeAttendance.clear();
				this.oldAttendanceAlternative = Object.assign({}, this.alternativeAttendance);
				this.initAlternativeAttendant();
			}
		})
		this.subscription.push(routeSubscription)
	}
	ngOnDestroy() {
		this.subscription.forEach(s => s.unsubscribe());
	}
	onSumbit(withBack: boolean = false) {
		if (this.selectedTab == 0) {
			this.hasFormErrors = false;
			const controls = this.AlternativeformGroup.controls;
			/** check form */
			if (this.AlternativeformGroup.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);
				this.hasFormErrors = true;
				this.errorMessage = 'Please check invalid fields'
				return;
			}

			const editedAlterntiveAttendance = this.prepareData();
			delete editedAlterntiveAttendance.alternativeAttendantID;
			if (this.oldAttendanceAlternative.alternativeAttendantID > 0) {
				this.updateData(editedAlterntiveAttendance, withBack);
				return;
			}

			this.addData(editedAlterntiveAttendance, withBack);
		}

	}


	createForm() {
		this.AlternativeformGroup = new FormGroup({
			groupID: new FormControl(this.alternativeAttendance.groupID, Validators.required),
			trackID: new FormControl(this.alternativeAttendance.trackID, Validators.required),
			trainerID: new FormControl(this.alternativeAttendance.trainerID, Validators.required),
			class: new FormControl(this.alternativeAttendance.class),
			hourFrom: new FormControl(this.alternativeAttendance.HourFrom, Validators.required),
			hourTo: new FormControl(this.alternativeAttendance.HourTo, Validators.required),
			date: new FormControl(this.alternativeAttendance.date, [Validators.required]),
		});
	}
	prepareData(): AlternativeAttendant {
		const controls = this.AlternativeformGroup.controls;
		const _alternative = new AlternativeAttendant();
		_alternative.clear();
		_alternative.groupID = controls['groupID'].value;
		_alternative.trackID = controls['trackID'].value;
		_alternative.trainerID = controls['trainerID'].value;
		_alternative.HourFrom = controls['hourFrom'].value;
		_alternative.HourTo = controls['hourTo'].value;
		_alternative.class = controls['class'].value;
		_alternative.date = controls['date'].value;
		if(!controls['class'].value){
			delete _alternative.class
		}
		
		
		return _alternative;
	}

	updateData(_alter: AlternativeAttendant, withBack: boolean = false) {
		//Check if nothing changed

		if (_alter.groupID == this.oldAttendanceAlternative.groupID && _alter.trackID == this.oldAttendanceAlternative.trackID &&
			_alter.trainerID == this.oldAttendanceAlternative.trainerID && _alter.class == this.oldAttendanceAlternative.class &&
			_alter.HourFrom == this.oldAttendanceAlternative.HourFrom && _alter.HourTo == this.oldAttendanceAlternative.HourTo &&
			_alter.date == this.oldAttendanceAlternative.date 
		) {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update AlternativeAttendance', 'message': 'There are no changes, Are you sure you want to exit?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.layoutUtilsService.showActionNotification('no changes')
					this.router.navigateByUrl('/alternativeAttendant')
				}
			});

		} else {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update AlternativeAttendance', 'message': 'There are something changed, Are you sure you want to update alternativeAttendance data?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {

					this.AlternativeSRV.UpdateAlternativeAttend(_alter, this.oldAttendanceAlternative.alternativeAttendantID).subscribe(res => {
						if(res.result==true){
							this.layoutUtilsService.showActionNotification('AlternativeAttendance has been succefully saved');
							this.router.navigateByUrl('/alternativeAttendant')
						}else{
							this.errorMessage=res.message;
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
	}

	addData(_alter: AlternativeAttendant, withBack: boolean = false) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add Alternative Attendant', 'message': ' Are you sure you want to add AlternativeAttendant?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.AlternativeSRV.AddAlternativeAttend(_alter).subscribe(res => {
					if(res.result==true){
						this.layoutUtilsService.showActionNotification('AlternativeAttendant has been succefully saved');
						this.router.navigateByUrl('/alternativeAttendant')
					}		else{
						this.errorMessage=res.message
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
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/alternativeAttendant`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	/**
 * Refresh Employee
 *
 * @param isNew: boolean
 * @param id: number
 */
	refreshAlternativeAttendant(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/alternativeAttendant/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  /**
	 * Reset
	 */
	reset() {
		this.alternativeAttendance = Object.assign({}, this.oldAttendanceAlternative);
		this.createForm();
		this.hasFormErrors = false;
		this.AlternativeformGroup.markAsPristine();
		this.AlternativeformGroup.markAsUntouched();
		this.AlternativeformGroup.updateValueAndValidity();
	}
	initAlternativeAttendant() {
		this.createForm();
		if (!this.alternativeAttendance.alternativeAttendantID) {
			this.subheaderService.setTitle('Create alternativeAttendance');
			this.subheaderService.setBreadcrumbs([
				{ title: 'AlternativeAttendance', page: `AlternativeAttendance` },
				{ title: 'AlternativeAttendance', page: `AlternativeAttendance` },
				{ title: 'Create Alternative Attendant', page: `alternativeAttendant/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit alternativeAttendance');
		this.subheaderService.setBreadcrumbs([
			{ title: 'alternativeAttendant ', page: `alternativeAttendant` },
			{ title: 'alternativeAttendant', page: `alternativeAttendant` },
			{ title: 'Edit AlternativeAttendance', page: `alternativeAttendant/edit`, queryParams: { id: this.alternativeAttendance.alternativeAttendantID } }
		]);
	}
	GetAllGroups() {
		let groups = this.groupSRV.getWorkingGroups().subscribe(g => {
			if (g.result == true) {
				this.allGroups = g.data;
			}

		})
		this.subscription.push(groups)
	}



	changeGroup() {
		this.allTracks=[]
		let group = this.groupSRV.getGroupByID(this.AlternativeformGroup.controls['groupID'].value).subscribe(res => {
			if (res.result == true) {
				if (res.group.groupTracks!=null&&res.group.groupTracks.length > 0) {
					this.groupTracks=res.group.groupTracks;
					this.groupCourse='';
					this.allTrainers=''
					for (let i = 0; i < res.group.groupTracks.length; i++) {
						let tracks = this.trackSRV.getTrackByID(res.group.groupTracks[i].trackID).subscribe(res => {
							if (res.result == true) {	
								this.allTracks.push(res.data);
							} 
						})	
						this.subscription.push(tracks)
					}
				} else {
					this.allTracks=[];
					this.allTrainers=''
					let course = this.CoursesService.getCourseByID(res.group.courseID).subscribe(res => {
						if (res.result == true) {
							this.groupCourse = res.data;
						}
						this.subscription.push(course)
					})
					let trainer= this.trainSRV.getTrainerByID(res.group.trainerID).subscribe(res=>{
						if(res.result==true){
							this.allTrainers=res.data
						}
						this.subscription.push(trainer)
					})
				}
			}
		})
		this.subscription.push(group)
	}

	changeTrack(){
		if(this.groupTracks){
    for(let i=0;i<this.groupTracks.length;i++){
			if(this.AlternativeformGroup.controls['trackID'].value==this.groupTracks[i].trackID){
				this.trainSRV.getTrainerByID(this.groupTracks[i].trainerID).subscribe(res=>{
					if(res.result==true){
						this.allTrainers=res.data;
					}
				})
				break;
			}
		}
	}
	}


	getComponentTitle() {
		let result = 'Create AlternativeAttendant';
		if (!this.alternativeAttendance || !this.alternativeAttendance.alternativeAttendantID) {
			return result;
		}

		result = `Edit AlternativeAttendant - ${this.alternativeAttendance.groupID}`;
		return result;
	}
	onAlertClose($event) {
		this.errorMessage = '';
	}
}

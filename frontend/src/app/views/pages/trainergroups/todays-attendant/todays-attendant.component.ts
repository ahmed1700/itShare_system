// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
// Models
import { SubheaderService } from '../../../../core/_base/layout';
//courses
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

//groups

import { GroupsService } from '../../../../core/auth/_services/group.service';
import { Group } from '../../../../core/auth/_models/group.model';

//Branch
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';
import { TrainergroupsDetailsComponent } from '../trainergroups-details/trainergroups-details.component';
import { TrainerSignINComponent } from '../trainer-sign-in/trainer-sign-in.component';
import { TrainerSignOUTComponent } from '../trainer-sign-out/trainer-sign-out.component';
import { ChangePassComponent } from '../change-pass/change-pass.component';

import { TeachingAttendantService } from '../../../../core/auth/_services/teachingAttendant';
import { teachingAttendant } from '../../../../core/auth/_models/teachingAttendant';

import { AlternativeAttendantService } from '../../../../core/auth/_services/alternative-attendant.service'
import { AlternativeAttendant } from '../../../../core/auth/_models/alternativeAttendant.model';

import { IpServiceService } from '../../../../core/auth/_services/ip-service.service';
import { StudentAttendComponent } from '../student-attend/student-attend.component';

@Component({
	selector: 'kt-todays-attendant',
	templateUrl: './todays-attendant.component.html',
	styleUrls: ['./todays-attendant.component.scss']
})
export class TodaysAttendantComponent implements OnInit, OnDestroy {

	ipAddress
	private subscriptions: Subscription[] = [];
	dataSource: MatTableDataSource<any>;
	dataSource2: MatTableDataSource<any>;

	displayedColumns = ['groupID', 'groupName', 'branch', 'groupType', 'class', 'actions'];
	displayedColumns2 = ['groupID', 'groupName', 'from', 'to', 'class', 'actions'];

	@ViewChild('paginator', { static: false }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: false }) paginator2: MatPaginator;

	@ViewChild('sort', { static: false }) sort: MatSort;
	@ViewChild('sort2', { static: false }) sort2: MatSort;


	AlternativeAttendant: AlternativeAttendant[]
	GroupsResult: Group[] = [];
	teachingAttendant: teachingAttendant[];
	groups: Group[] = [];
	// Selection
	selection = new SelectionModel<Group>(true, []);

	allCourses: Course[];
	selectedTab: number = 0;
	allBranches: Branch[];
	trainerID: number;

	constructor(
		private coursesService: CoursesService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private groupsService: GroupsService,
		private branchesService: branchesService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
		private ip: IpServiceService,

	) { }
	ngOnInit() { 

		this.trainerID = JSON.parse(localStorage.getItem('currentTrainer')).trainerID;
		this.ip.getIPAddress().subscribe((res: any) => {
			this.ipAddress = res.ip
		})

		this.getAllBranches();
		this.loadGroupsList(this.trainerID);
		this.subheaderService.setTitle('Trainer Groups');
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}




	loadGroupsList(trainerID: number) {
		this.selection.clear();

		const Group = this.groupsService.getTodaysGroupForTrainer(trainerID).subscribe((res) => {

			this.GroupsResult = res.trainerGroups;

			this.dataSource = new MatTableDataSource<Group>(this.GroupsResult);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;

			this.AlternativeAttendant = res.alternative
			this.dataSource2 = new MatTableDataSource<any>(this.AlternativeAttendant);
			this.dataSource2.sort = this.sort2;
			this.dataSource2.paginator = this.paginator2;

			if (this.AlternativeAttendant && this.AlternativeAttendant.length > 0) {
				this.AlternativeAttendant.forEach(g => {
					this.groupsService.getGroupByID(g.groupID).subscribe(res => {
						if (res.result == true) {
							this.groups.push(res.group)
						}
					})
				})
			}

			this.teachingAttendant = res.todatAttendant
			this.cdr.detectChanges();
		})
		this.subscriptions.push(Group)
		this.selection.clear();
	}

	onTabChanged($event) {
		this.dataSource = new MatTableDataSource<Group>(this.GroupsResult);
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;

		this.dataSource2 = new MatTableDataSource<any>(this.AlternativeAttendant);
		this.dataSource2.sort = this.sort2;
		this.dataSource2.paginator = this.paginator2;


	}



	getAllBranches() {
		let branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
			}
		})
		this.subscriptions.push(branches)
	}


	getGroupName(id) {
		if (this.groups && this.groups.length > 0) {
			let group = this.groups.find(p => p.groupID === id);
			return group.groupName
		}
	}




	getBranchName(id) {
		if (this.allBranches) {
			if (this.allBranches.length > 0) {
				const branches = this.allBranches.find(branch => branch.branchID === id)
				return branches.name
			}
		}
	}

	getCourseName(id) {
		if (this.allCourses) {
			if (this.allCourses.length > 0) {
				const courses = this.allCourses.find(course => course.courseID === id)
				return courses.courseName
			}
		}
	} 


	signOut(id, status) {
		console.log(status)
		let attendant = this.teachingAttendant.filter(p => p.groupID === id);
		const dialogRef = this.dialog.open(TrainerSignOUTComponent, {
			data: { data: { teacheingAttendantID: attendant[0].teacheingAttendantID, ip: this.ipAddress }, status: status },
			width: '800px',
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification('You Signed Out Succefully');
			this.ngOnInit()
		})

	}

	signIn(group: Group) {
		const dialogRef = this.dialog.open(TrainerSignINComponent, {
			data: { data: { groupID: group.groupID, trainerID: this.trainerID, trackID: group.groupTracks[0].trackID, ip: this.ipAddress }, status: 'today' },
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification('You Signed In Succefully');
			this.ngOnInit()
		})



	}

	isTrainerSignedIn(id) {

		let attendant = this.teachingAttendant.filter(p => p.groupID === id);

		if (attendant.length > 0) {
			if (attendant[0].signin) {
				return false;
			}
			if (!attendant[0].signin) {
				return true;
			}

		} else {
			return true
		}
	}
	isTrainerSignedOut(id) {
		let attendant = this.teachingAttendant.filter(p => p.groupID === id);
		if (attendant.length > 0) {
			if (attendant[0].signin && !attendant[0].signOut) {
				return true
			}
			if (attendant[0].signin && attendant[0].signOut) {
				return false
			}
			if (attendant[0].signOut) {
				return false;
			}
		} else {
			return false
		}

	}

	DelaySignIn(alternative: AlternativeAttendant) {
		if (alternative.trackID) {
			const dialogRef = this.dialog.open(TrainerSignINComponent, {
				data: { data: { groupID: alternative.groupID, trainerID: this.trainerID, trackID: alternative.trackID, ip: this.ipAddress }, status: 'delay' },
				width: '800px',

			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				this.layoutUtilsService.showActionNotification('You Signed In Succefully');
				this.ngOnInit()
			})
		}
	}
	studentAttend(group){
		if(group.groupTracks&&group.groupTracks.length>0){
			const dialogRef = this.dialog.open( StudentAttendComponent, {
				data: { data: { groupID: group.groupID, trackID: group.groupTracks[0].trackID, ip: this.ipAddress } },
				width: '500px',
	
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				this.layoutUtilsService.showActionNotification('Student Signed In Succefully');
			
			})
		}else{
			const dialogRef = this.dialog.open( StudentAttendComponent, {
				data: { data: { groupID: group.groupID, trackID: group.trackID, ip: this.ipAddress } },
				width: '500px',
	
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				this.layoutUtilsService.showActionNotification('Student Signed In Succefully');
			
			})
		}
		

	}
}

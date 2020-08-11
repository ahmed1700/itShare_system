// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
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

//imported component
import { TrainergroupsDetailsComponent } from '../trainergroups-details/trainergroups-details.component';

import { TeachingAttendantService } from '../../../../core/auth/_services/teachingAttendant';
import { teachingAttendant } from '../../../../core/auth/_models/teachingAttendant';
//alternative attendant service
import { AlternativeAttendantService } from '../../../../core/auth/_services/alternative-attendant.service'
import { AlternativeAttendant } from '../../../../core/auth/_models/alternativeAttendant.model';

import { IpServiceService } from '../../../../core/auth/_services/ip-service.service';


//calender 
import {
	startOfDay,
	endOfDay,
	setHours,
	setMinutes,
	subDays,
	addDays,
	endOfMonth,
	isSameDay,
	isSameMonth,
	addHours
} from 'date-fns';
import {
	CalendarEvent,
	CalendarEventAction,
	CalendarEventTimesChangedEvent,
	CalendarView,
	MOMENT,
} from 'angular-calendar';
import { TrainerPaymentComponent } from '../trainer-payment/trainer-payment.component';

const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	},
	blue: {
		primary: '#1e90ff',
		secondary: '#D1E8FF'
	},
	yellow: {
		primary: '#e3bc08',
		secondary: '#FDF1BA'
	}
};




@Component({
  selector: 'kt-trainer-calender',
  templateUrl: './trainer-calender.component.html',
  styleUrls: ['./trainer-calender.component.scss']
})
export class TrainerCalenderComponent implements OnInit , OnDestroy {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

	view: CalendarView = CalendarView.Day;

	CalendarView = CalendarView;

	viewDate: Date = new Date();

	modalData: {
		action: string;
		event: CalendarEvent;
	};

	notTodayactions: CalendarEventAction[] = [
		{
			label: '<i class="fa fa-fw fa-hand-pointer"></i>',
			a11yLabel: 'View',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.handleEvent('View', event)
			}
		},
	];

	today: number = Date.now();


	private subscriptions: Subscription[] = [];
	AlternativeAttendant: AlternativeAttendant[]
	GroupsResult: Group[] = [];
	trainerID: number;
	signedIN: boolean;
	signedOut: boolean;
	signedTrack;
	signedCourse;
	userName;
	teachingAttendant: teachingAttendant[];
	trainerPayment
	allBranches: Branch[];
	events: CalendarEvent[] = [];
	allCourses: Course[];
	activeDayIsOpen: boolean = true;
	constructor(
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private groupsService: GroupsService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
		private AlternativeAttendantService: AlternativeAttendantService,
		private ip: IpServiceService,
		private branchesService: branchesService,
		private teachingAttendantService: TeachingAttendantService,
		private activatedRoute:ActivatedRoute

	) { }
	ngOnInit() {
		this.trainerID = JSON.parse(localStorage.getItem('currentTrainer')).trainerID;
		this.userName = JSON.parse(localStorage.getItem('currentTrainer')).fullNameEnglish
		this.getAllBranches()
		this.loadGroupsList(this.trainerID);
		this.getDelayAttendant()

	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	getAllBranches() {
		let branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
			}
		})
		this.subscriptions.push(branches)
	}


	getBranchName(id) {
		if (this.allBranches) {
			if (this.allBranches.length > 0) {
				const branches = this.allBranches.find(branch => branch.branchID === id)
				return branches.name
			}
		}
	}

	getBranchNameDelay(id) {
		let group = this.GroupsResult.find(group => group.groupID === id)
		if (this.allBranches) {
			if (this.allBranches.length > 0) {
				const branches = this.allBranches.find(branch => branch.branchID === group.branchID)
				return branches.name
			}
		}
	}

	getGroupName(id) {
		if (this.GroupsResult) {
			let group = this.GroupsResult.find(group => group.groupID === id)
			return group.groupName
		}
	}

	getDelayAttendant() {
		this.AlternativeAttendantService.getTrainerAlternativeAttendant(this.trainerID).subscribe(res => {
			if (res.result == true) {
				this.AlternativeAttendant = res.data;
				for (let element of this.AlternativeAttendant) {
					let hours = 0, minutes = 0;
					const resulltHourfrom = element.HourFrom.split(":");
					var dHourfrom = new Date(0, 0, 0, +resulltHourfrom[0], +resulltHourfrom[1]);
					const resulltHourto = element.HourTo.split(":");
					var dHourto = new Date(0, 0, 0, +resulltHourto[0], +resulltHourto[1]);
					hours = dHourto.getHours() - dHourfrom.getHours();
					minutes = dHourto.getMinutes() - dHourfrom.getMinutes();
					let groupActualHours = hours + '.' + minutes
					this.events.push(
						{ 
							start: new Date(element.date),
							end: addHours(new Date(element.date), +groupActualHours),
							title: "Group" + this.getGroupName(element.groupID) + '_' + this.getBranchNameDelay(element.groupID),
							id: +element.groupID,
							color: colors.red,
							actions: this.notTodayactions,
							resizable: {
								beforeStart: true,
								afterEnd: true
							},
							draggable: true
						})
				   }
				
				
				this.cdr.detectChanges();
			}
		})
	}

	loadGroupsList(trainerID: number) {
		const Group = this.groupsService.getTrainerGroups(trainerID).subscribe((res) => {
			this.GroupsResult = res.trainerGroups;
			for (let element of this.GroupsResult) {
				if (element.groupTracks && element.groupTracks.length > 0) {
					for (let groupTrack of element.groupTracks) {
						for (let trackHistory of groupTrack.trackHistory) {
							var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
							var d = new Date(trackHistory);
							var dayName = days[d.getDay()];
							let gSchedule = element.groupSchedule.find(g => g.days === dayName);
							let hours = 0, minutes = 0;
				 
							const resulltHourfrom = gSchedule.Hourfrom.split(":");
							var dHourfrom = new Date(0, 0, 0, +resulltHourfrom[0], +resulltHourfrom[1]);
							const resulltHourto = gSchedule.Hourto.split(":");
							var dHourto = new Date(0, 0, 0, +resulltHourto[0], +resulltHourto[1]);
							hours = dHourto.getHours() - dHourfrom.getHours();
							minutes = dHourto.getMinutes() - dHourfrom.getMinutes();
							let groupActualHours = hours + '.' + minutes


								this.events.push(
									{ 
										start: new Date(trackHistory),
										end: addHours(new Date(trackHistory), +groupActualHours),
										title: "Group " + element.groupName + '_' + this.getBranchName(element.branchID),
										id: +element.groupID,
										color: colors.blue,
										actions: this.notTodayactions,
										//	
										resizable: {
											beforeStart: true,
											afterEnd: true
										},
										draggable: true
									})
							}

						}
					
				}
			}
			this.cdr.detectChanges();
		})
		this.subscriptions.push(Group)
	}

	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
		if (isSameMonth(date, this.viewDate)) {
			if (
				(isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
				events.length === 0
			) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
			}
			this.viewDate = date;
		}
	}

	eventTimesChanged({
		event,
		newStart,
		newEnd,

	}: CalendarEventTimesChangedEvent): void {
		this.events = this.events.map(iEvent => {
			if (iEvent === event) {
				return {
					...event,
					start: newStart,
					end: newEnd,
				};
			}
			return iEvent;
		});

	}

	handleEvent(action: string, event: CalendarEvent): void {
	
	
		this.router.navigate([`/trainergroups/view/${event.id}`]);

	} 

	deleteEvent(eventToDelete: CalendarEvent) {
		this.events = this.events.filter(event => event !== eventToDelete);
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	closeOpenMonthViewDay() {
		this.activeDayIsOpen = false;
	}


}

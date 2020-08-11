import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

//alternative attendant service
import { AlternativeAttendantService } from '../../../../core/auth/_services/alternative-attendant.service'
import { AlternativeAttendant } from '../../../../core/auth/_models/alternativeAttendant.model';

//Branch
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';
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


import { GroupsService } from '../../../../core/auth/_services/group.service';
import { Group } from '../../../../core/auth/_models/group.model';

import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';


@Component({
  selector: 'kt-groups-calender',
  templateUrl: './groups-calender.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./groups-calender.component.scss']
})
export class GroupsCalenderComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  constructor(private modal: NgbModal,
    private gService: GroupsService, private coursesService: CoursesService,
    private AlternativeAttendantService: AlternativeAttendantService,
    private branchesService: branchesService,
    private router: Router,
  ) { }
  view: CalendarView = CalendarView.Day;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  allBranches: Branch[];
  AlternativeAttendant: AlternativeAttendant[]
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  ngOnInit() {
    
    
    this.loadGroupsList(); 
  //  this.getDelayAttendant()
  }
  actions: CalendarEventAction[] = [
    {
			label: '<i class="fa fa-fw fa-hand-pointer"></i>',
			a11yLabel: 'View',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.handleEvent('View', event)
			}
		},
  ];
  private subscriptions: Subscription[] = [];
  refresh: Subject<any> = new Subject();
  group: Group[];
  loadGroupsList() {
    if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin'){
     let branchID=JSON.parse(localStorage.getItem('currentUser')).branchID
      const Group = this.gService.getWorkingGroupsByBranch(branchID).subscribe((res) => {
        if (res.result == true) {
          this.group = res.data;
  
          for (let element of this.group) {
  
            for (let courcehistory of element.cousreHistory) {
              var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              var d = new Date(courcehistory);
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
                  start: new Date(courcehistory),
                  end: addHours(new Date(courcehistory), +groupActualHours),
                  title: "Group " + element.groupName ,
                  color: colors.blue,
                  id: +element.groupID,
                  actions: this.actions,
                  resizable: { 
                    beforeStart: true,
                    afterEnd: true
                  },
                  draggable: true
                })
            }
          }
  
        } else {
  
        }
      })
      this.subscriptions.push(Group)
  
      console.log(this.events);
    }else{
      this.getAllBranches()
      const Group = this.gService.getWorkingGroups().subscribe((res) => {
        if (res.result == true) {
          this.group = res.data;
  
          for (let element of this.group) {
  
            for (let courcehistory of element.cousreHistory) {
              var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              var d = new Date(courcehistory);
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
                  start: new Date(courcehistory),
                  end: addHours(new Date(courcehistory), +groupActualHours),
                  title: "Group " + element.groupName + this.getBranchName(element.branchID),
                  color: colors.blue,
                  id: +element.groupID,
                  actions: this.actions,
                  resizable: { 
                    beforeStart: true,
                    afterEnd: true
                  },
                  draggable: true
                })
            }
          }
  
        } else {
  
        }
      })
      this.subscriptions.push(Group)
  
      console.log(this.events);
    }
    
  }

  events: CalendarEvent[] = [];
  allCourses: Course[];
  activeDayIsOpen: boolean = true;


  getBranchName(id) {
    if (this.allBranches) {
      if (this.allBranches.length > 0) {
        const branches = this.allBranches.find(branch => branch.branchID === id)
        return branches.name
      }
    }
  }

  getBranchNameDelay(id) {
    console.log(this.group,'aaaaaaaaaaaaaaaaaaaaaaaaaaa')
    let group = this.group.find(group => group.groupID === id)
    if (this.allBranches) {
      if (this.allBranches.length > 0) {
        const branches = this.allBranches.find(branch => branch.branchID === group.branchID)
        return branches.name
      }
    }
  }

  getGroupName(id) {
    if (this.group&&this.group.length>0) {
      let group = this.group.find(group => group.groupID === id)
      return group.groupName
    }
  }
  
  getDelayAttendant() {
    this.AlternativeAttendantService.GetAllAlternativeAttendant().subscribe(res => {
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
         //   title: "Group" + this.getGroupName(element.groupID),
              id: +element.groupID,
              color: colors.red,
              actions: this.actions,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true
            })
        }

      }
    })
  }
  getAllBranches() {
    let branches = this.branchesService.getBranches().subscribe(res => {
      if (res.result == true) {
        this.allBranches = res.data;
      }
    })
    this.subscriptions.push(branches)
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
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });

  }


  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  } 

  handleEvent(action: string, event: CalendarEvent): void {

		this.router.navigate([`/groups/view/${event.id}`]);
	} 
}

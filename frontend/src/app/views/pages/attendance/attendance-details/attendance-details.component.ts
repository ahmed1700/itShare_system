import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';

import { TeachingAttendantService } from '../../../../core/auth/_services/teachingAttendant';
import { teachingAttendant } from '../../../../core/auth/_models/teachingAttendant';

import { AlternativeAttendantService } from '../../../../core/auth/_services/alternative-attendant.service';
import { AlternativeAttendant } from '../../../../core/auth/_models/alternativeAttendant.model';
import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';
import { Group } from '../../../../core/auth/_models/group.model';
import { GroupsService } from '../../../../core/auth/_services/group.service';

// Course
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

import { EditAttendantComponent } from '../edit-attendant/edit-attendant.component';
import { element } from 'protractor';




@Component({
  selector: 'kt-attendance-details',
  templateUrl: './attendance-details.component.html',
})
export class AttendanceDetailsComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<teachingAttendant>;
  displayedColumns = ['ID', 'group', 'track', 'trainer', 'date', 'signin', 'signOut', 'actualTeachedHour', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  teachingAttendantList: teachingAttendant[];
  teachingAttendantListFilter: teachingAttendant[];
  selection = new SelectionModel<teachingAttendant>(true, []);
  groups: Group[];
  trainer: Trainer[] = [];
  selectedGroup = 0
  selectedTrainer = 0
  selectedTrack = 0
  isAdmin: boolean;
  allTracks: Track[]=[];
  trainerPayment
  trainerPricePerHour = 0;
  teachingAttendance
  canFind: boolean = false
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private CoursesService: CoursesService,
    private teachingAttendantService: TeachingAttendantService,
    private GroupsService: GroupsService,
    private dialog: MatDialog,
    private TrainersService: TrainersService,
    private TracksService: TracksService,
  ) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }
   // this.getAllTracks()
    this.getAllGroups()
    //this.getAllTrainer()
    //  this.loadAttendantList();

  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  getAllTracks() {
    this.TracksService.getTracks().subscribe(res => {
      if (res.result == true) {
        this.allTracks = res.data
        this.cdr.detectChanges()
      }
    })
  }


  getTacksAndTrainers() {
    this.trainer = []
    this.allTracks=[]
    if (this.selectedGroup) {
      let group = this.groups.find(p => p.groupID === this.selectedGroup)
      let TrainersID = group.groupTracks.map(trainer => trainer.trainerID)
      TrainersID = TrainersID.filter((v, i) => TrainersID.indexOf(v) === i)
      TrainersID.forEach(elem => {
        this.TrainersService.getTrainerByID(elem).subscribe(res => {
          if (res.result == true) {
            this.trainer.push(res.data)
          }
        })
      })


      let TracksID = group.groupTracks.map(track => track.trackID)
      TracksID = TracksID.filter((v, i) => TracksID.indexOf(v) === i)
      TracksID.forEach(elem => {
        this.TracksService.getTrackByID(elem).subscribe(res => {
          if (res.result == true) {
            this.allTracks.push(res.data)
          }
        })
      })
    }
  }

  getTrackName(id) {
    if (this.allTracks) {
      if (this.allTracks.length > 0) {
        const track = this.allTracks.find(track => track.trackID === id)
        return track.trackName
      }
    }

  }

  loadAttendantList() {
    this.selection.clear();
    const attendant = this.teachingAttendantService.getAttendantByAdmin(this.selectedTrainer,this.selectedGroup,this.selectedTrack).subscribe(res => {
      if (res.result == true) {
        this.teachingAttendantList = res.data;
        this.teachingAttendantListFilter = this.teachingAttendantList;
        this.dataSource = new MatTableDataSource<teachingAttendant>(this.teachingAttendantList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }

    }, error => {
      console.log(error.error)
    }
    )
    this.subscriptions.push(attendant)
    this.selection.clear();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  getAllGroups() {
    this.GroupsService.getWorkingGroups().subscribe(res => {
      this.groups = res.data;
      this.cdr.detectChanges();
    })
  }

  getAllTrainer() {
    this.TrainersService.getTrainers().subscribe(res => {
      this.trainer = res.data;
      this.cdr.detectChanges();
    })
  }
	/**
	 * Toggle selection
	 */

  getGroupName(id) {
    if (this.groups) {
      let group = this.groups.find(p => p.groupID === id)
      return group.groupName
    }

  }

  getTrainerName(id) {
    if (this.trainer) {
      let trainer = this.trainer.find(p => p.trainerID === id)
      return trainer.fullNameEnglish
    }

  }


  filterByPramters() {
    if (this.selectedGroup && this.selectedTrack && this.selectedTrainer) {
       this.canFind=true
    }

  }

  findAttendant() {
  this.loadAttendantList()
  }


  editAttendant(attendendance: teachingAttendant) {
    const dialogRef = this.dialog.open(EditAttendantComponent, {
      data: attendendance,
      width: '800px',

    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification('Attendance Updated Succefully');
      this.loadAttendantList()

    })
  }

}

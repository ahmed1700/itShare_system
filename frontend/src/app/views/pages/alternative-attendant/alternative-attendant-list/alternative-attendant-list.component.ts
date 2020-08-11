// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// angular material
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';

// Models
import { SubheaderService } from '../../../../core/_base/layout';
// Services
import { AlternativeAttendantService } from '../../../../core/auth/_services/alternative-attendant.service';
import { AlternativeAttendant } from '../../../../core/auth/_models/alternativeAttendant.model';
import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';
import { Group } from '../../../../core/auth/_models/group.model';
import { GroupsService } from '../../../../core/auth/_services/group.service';

@Component({
  selector: 'kt-alternative-attendant-list',
  templateUrl: './alternative-attendant-list.component.html',

})
export class AlternativeAttendantListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: MatTableDataSource<AlternativeAttendant>;
  displayedColumns = ['AlternatedID', 'GroupName', 'Class', 'hourFrom', 'hourTo', 'date', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  AlternativeAttendantResult: AlternativeAttendant[] = [];
  allGroups: Group[] = [];
  allTracks: Track[] = [];
  allTrainers: Trainer[] = [];


  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(private AlternativeSRV: AlternativeAttendantService,
    private trackSRV: TracksService,
    private trainSRV: TrainersService,
    private groupSRV: GroupsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.loadAllAltrnativeAttendant();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Delay Days');
  }
  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
  loadAllAltrnativeAttendant() {

    let alternative = this.AlternativeSRV.GetAllAlternativeAttendant().subscribe((result) => {
      if (result.result == true) {
        this.AlternativeAttendantResult = result.data;
        this.GetAllGroups();
        this.dataSource = new MatTableDataSource<AlternativeAttendant>(this.AlternativeAttendantResult);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
    })
    this.subscriptions.push(alternative)
  }
  GetAllGroups() {

    let groups = this.groupSRV.getWorkingGroups().subscribe(g => {
      if (g.result == true) {
        this.allGroups = g.data;
        this.cdr.detectChanges();
      }

    })
    this.subscriptions.push(groups)
  }
  GetAllTracks() {
    let tracks = this.trackSRV.getTracks().subscribe(res => {
      if (res.result == true) {
        this.allTracks = res.data;
        this.cdr.detectChanges();
      }
    })
    this.subscriptions.push(tracks)
  }
  GetAllTrainers() {
    let trainers = this.trainSRV.getTrainers().subscribe(res => {
      if (res.result == true) {
        this.allTrainers = res.data;
        this.cdr.detectChanges();
      }
    })
    this.subscriptions.push(trainers)
  }

  getGroupName(id) {
    if (this.allGroups && this.allGroups.length > 0) {
      const groups = this.allGroups.find(group => group.groupID === id)
      return groups.groupName
    }
  }

  getTrackName(id) {
    if (this.allTracks && this.allTracks.length > 0) {
      const tracks = this.allTracks.find(track => track.trackID === id)
      return tracks.trackName
    }
  }

  getTrainerName(id) {
    if (this.allTrainers && this.allTrainers.length > 0) {
      const trainers = this.allTrainers.find(trainer => trainer.trainerID === id)
      return trainers.fullNameArabic
    }
  }

  editAttendance(id) {
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }

}

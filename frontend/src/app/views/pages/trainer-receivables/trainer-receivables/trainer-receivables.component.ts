import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';
import { Group } from '../../../../core/auth/_models/group.model';
import { GroupsService } from '../../../../core/auth/_services/group.service';
import { TrainerPayComponent } from '../trainer-pay/trainer-pay.component';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-trainer-receivables',
  templateUrl: './trainer-receivables.component.html',
  styleUrls: ['./trainer-receivables.component.scss']
})


export class TrainerReceivablesComponent implements OnInit , OnDestroy {

  dataSource: MatTableDataSource<Group>;
  groupTracks=[]
   
  displayedColumns = ['ID', 'group', 'groupTracks.track', 'groupTracks.trainer', 'groupTracks.totalTeachedHours', 'groupTracks.trainerTotalTeachedHours','groupTracks.trainerPricePerHour', 'actions'];
 //displayedColumns = ['ID', 'group', 'groupTracks', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  GroupList: Group[];
  GroupListFilter: Group[];
  selection = new SelectionModel<Group>(true, []);
  trainer: Trainer[]=[];
  allTracks: Track[]=[];
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private GroupsService: GroupsService,
    private dialog: MatDialog,
    private TrainersService: TrainersService,
    private TracksService: TracksService,
    private router:Router
  ) { }

  ngOnInit() {
    this.getAllGroups()
  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  
  getTrackName(id) {
    if (this.allTracks&&this.allTracks.length>0) {
      if (this.allTracks.length > 0) {
        const track = this.allTracks.find(track => track.trackID === id)
        return track.trackName
      }
    }

  }

  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  

  getAllGroups() {
    this.GroupsService.getTrainerPayment().subscribe(res => {
      this.GroupList = res.data;
      
      if(this.GroupList&&this.GroupList.length>0){
        this.GroupList.forEach(element=>{
          element.groupTracks.forEach(track=>{
            this.groupTracks.push(track)
            this.TrainersService.getTrainerByID(track.trainerID).subscribe(res=>{
              if(res.result==true){
                 this.trainer.push(res.data)
              }
            })
            this.TracksService.getTrackByID(track.trackID).subscribe(res=>{
              if(res.result==true){
                 this.allTracks.push(res.data)
              }
            })
          })
        })
      }
        this.dataSource = new MatTableDataSource<Group>(this.groupTracks)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    })
  }

  
	/**
	 * Toggle selection
	 */

  getTrainerName(id) {
    if (this.trainer&&this.trainer.length>0) {
      let trainer = this.trainer.find(p => p.trainerID === id)
      return trainer.fullNameEnglish
    }

  }

  getGroupName(groupTrack){
    let group = this.GroupList.find(P=>P.groupTracks.includes(groupTrack))
    return group.groupName
  }

  getGroupID(groupTrack){
    let group = this.GroupList.find(P=>P.groupTracks.includes(groupTrack))
    return group.groupID
  }
  
  payForTrainer(groupTrack) {
    let group = this.GroupList.find(P=>P.groupTracks.includes(groupTrack))
    const dialogRef = this.dialog.open(TrainerPayComponent, {
      data: {groupID:group.groupID,groupTrack:groupTrack},
      width: '800px',

    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return; 
      }
      this.layoutUtilsService.showActionNotification('Payed Succefully');
       this.router.navigateByUrl('/trainerpayment')
    })
  }


}

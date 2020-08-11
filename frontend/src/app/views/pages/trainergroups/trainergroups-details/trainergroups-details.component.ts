import { Component, OnInit, Inject, OnDestroy ,ChangeDetectorRef,} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { GroupsService } from '../../../../core/auth/_services/group.service';
//groups
import { Group } from '../../../../core/auth/_models/group.model';
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';
import { Subscription } from 'rxjs';
import { Track } from '../../../../core/auth/_models/Tracks.model';
import { teachingAttendant } from '../../../../core/auth/_models/teachingAttendant';
import { TeachingAttendantService } from '../../../../core/auth/_services/teachingAttendant';
@Component({
  selector: 'kt-trainergroups-details',
  templateUrl: './trainergroups-details.component.html',
  styleUrls: ['./trainergroups-details.component.scss']
})
export class TrainergroupsDetailsComponent implements OnInit, OnDestroy {

  groupID;
  group: Group;
  assignStudents: AssignStudent[];
  Coursename;
  allTracks: Track[];
  teachingAttendant: teachingAttendant[];
  courseID;
  trainerID
  
  private subscriptions: Subscription[] = [];
  constructor(
    private CoursesService: CoursesService,
    private activatedRoute:ActivatedRoute,
    private  groupsService: GroupsService,
    private teachingAttendantService:TeachingAttendantService,
    private CDR:ChangeDetectorRef,
  ) { }
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  ngOnInit() {
       this.trainerID= JSON.parse(localStorage.getItem('currentTrainer')).trainerID;
       const routeSubscription = this.activatedRoute.params.subscribe(params => {
        const id = params['id'];
        this.groupsService.getGroupByID(id).subscribe(res=>{
          if(res.result==true){
            res.group.groupTracks=res.group.groupTracks.filter(t=>t.trainerID===this.trainerID)
            this.group=res.group
            console.log(this.group.groupTracks)
             this.CDR.detectChanges()
            this.courseID = this.group.courseID
            let course = this.CoursesService.getCourseByID(this.group.courseID).subscribe(courseres => {
              this.Coursename = courseres.data.courseName;
              this.allTracks=courseres.tracks
              this.CDR.detectChanges()
            })
          }
        })
          let attendant = this.teachingAttendantService.trainerAttendant(this.trainerID, id).subscribe(res => {
            if (res.result == true) {
              this.teachingAttendant = res.data 
              this.CDR.detectChanges()
            }
            this.subscriptions.push(attendant)
          })
        
       })
  
        
       
    
    this.subscriptions.push(routeSubscription);
  }
 

  
  getTrackName(id) {
    if (this.allTracks) {
      if (this.allTracks.length > 0) {
        const track = this.allTracks.find(track => track.trackID === id)
        return track.trackName
      }
    }
  }

  getTrainerName(id) {
    return JSON.parse(localStorage.getItem('currentTrainer')).fullNameEnglish
  }
  getTrackHours(id) {
    if (this.allTracks) {
      if (this.allTracks.length > 0) {
        const track = this.allTracks.find(track => track.trackID === id)
        return track.trackHours
      }
    }
  }
 
  


}

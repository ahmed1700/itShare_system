import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AssignStudentService } from '../../../../core/auth/_services/assignStudent.service';
import { Group } from '../../../../core/auth/_models/group.model';
import { Track } from '../../../../core/auth/_models/Tracks.model';

@Component({
  selector: 'kt-student-attendant',
  templateUrl: './student-attendant.component.html',
  styleUrls: ['./student-attendant.component.scss']
})
export class StudentAttendantComponent implements OnInit {

  studentAttendant
  groups:Group []
  tracks:Track []
  constructor(
    public dialogRef: MatDialogRef<StudentAttendantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assignStudentService:AssignStudentService
  ) { }

  ngOnInit() {
     this.assignStudentService.getStudentAttendByID(this.data).subscribe(res=>{
       if(res.result==true){
           this.studentAttendant=res.data
           this.groups =res.groups
           this.tracks=res.tracks
       }
     })
  }

  getGroupName(id){
    if(this.groups){
      let group = this.groups.find(g=>g.groupID===id)
      return group.groupName
    }
  }
  getTrackName(id){
    if(this.tracks){
      let track = this.tracks.find(t=>t.trackID===id)
      return track.trackName
    }
  }
  

  

}
 
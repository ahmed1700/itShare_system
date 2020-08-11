import { Component, OnInit , Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import {TeachingAttendantService} from '../../../../core/auth/_services/teachingAttendant'

@Component({
  selector: 'kt-trainer-sign-out',
  templateUrl: './trainer-sign-out.component.html',
  styleUrls: ['./trainer-sign-out.component.scss']
})
export class TrainerSignOUTComponent implements OnInit {

  errorMessage;
  constructor(
    public dialogRef: MatDialogRef<TrainerSignOUTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TeachingAttendantService:TeachingAttendantService
  ) { }

  ngOnInit() {
    console.log(this.data)
    console.log(this.data.data.ip)
  }
  onNoClick(){
    this.dialogRef.close();
  }
  sign(){
    if(this.data.status=='today'){
     
    this.TeachingAttendantService.trainerSignOut(this.data.data.teacheingAttendantID,this.data.data.ip).subscribe(res=>{
      if(res.result==true){
        this.dialogRef.close({ res })
      }else{
      this.errorMessage=res.message;
      }
    })
  }else{
      this.TeachingAttendantService.delaySignOut(this.data.data.teacheingAttendantID,this.data.data.ip).subscribe(res=>{
        if(res.result==true){
          this.dialogRef.close({ res })
        }else{
        this.errorMessage=res.message;
        }
      })
    }
  }

}

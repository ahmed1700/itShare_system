import { Component, OnInit , Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import {TeachingAttendantService} from '../../../../core/auth/_services/teachingAttendant'

@Component({
  selector: 'kt-trainer-sign-in',
  templateUrl: './trainer-sign-in.component.html',
  styleUrls: ['./trainer-sign-in.component.scss']
})
export class TrainerSignINComponent implements OnInit {
errorMessage;
  constructor(
    public dialogRef: MatDialogRef<TrainerSignINComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TeachingAttendantService:TeachingAttendantService
  ) { }

  ngOnInit() {
    console.log(this.data)
  }
  onNoClick(){
    this.dialogRef.close();
  }
  sign(){
    if(this.data.status=='today'){
      this.TeachingAttendantService.trainerSignIn(this.data.data).subscribe(res=>{
        if(res.result==true){
          this.dialogRef.close({ res })
        }else{
        this.errorMessage=res.message;
        }
      })
    }else{
      this.TeachingAttendantService.delaySignIn(this.data.data).subscribe(res=>{
        if(res.result==true){
          this.dialogRef.close({ res })
        }else{
        this.errorMessage=res.message;
        }
      })
    }
    
  }

}

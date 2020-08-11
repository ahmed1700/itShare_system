import { Component, OnInit , Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

// student
import {TrainersService} from '../../../../core/auth/_services/trainers.service';
import {Trainer} from   '../../../../core/auth/_models/Trainers.model';

@Component({
  selector: 'kt-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  errorMessage;
  newPass
  constructor(
    public dialogRef: MatDialogRef<ChangePassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TrainersService:TrainersService
  ) { }

  ngOnInit() {
    console.log(this.data)
  }
  onNoClick(){
    this.dialogRef.close();
  }
  
  changePass(){
    if(!this.newPass){
     this.errorMessage='Please Enter Your New Password'
     return
    }else{
      this.TrainersService.changePassword(this.data,this.newPass).subscribe(res=>{
        if(res.result==true){
          this.dialogRef.close({ res })
          }else{
          this.errorMessage=res.message;
          }
        
      })
    }
  }
    onAlertClose($event){
   this.errorMessage=''
    }
    
  
    
  


}

import { Component, OnInit , Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
 
// Employees
import {EmployeesService} from '../../../../core/auth/_services/employees.service';
import {Employee} from   '../../../../core/auth/_models/employees.model';

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
    private EmployeesService:EmployeesService
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

      
      this.EmployeesService.changePassword(this.data,this.newPass).subscribe(res=>{
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

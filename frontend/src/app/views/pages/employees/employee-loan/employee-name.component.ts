import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

// Employees
import {EmployeesService} from '../../../../core/auth/_services/employees.service';
@Component({
  selector: 'kt-employee-name',
  templateUrl: './employee-name.component.html',
  styleUrls: ['./employee-name.component.scss']
})
export class EmployeeNameComponent implements OnInit {

  errorMessage;
  loanValue
  constructor(
    public dialogRef: MatDialogRef<EmployeeNameComponent>,
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
    if(!this.loanValue){
     this.errorMessage='Please Enter Your New Password'
     return
    }else{
      let loan={
        loanValue:this.loanValue,
        employeeID:this.data
      }
      this.EmployeesService.makeLoan(loan).subscribe(res=>{
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
 
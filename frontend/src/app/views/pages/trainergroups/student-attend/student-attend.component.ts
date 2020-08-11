import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import { TeachingAttendantService } from '../../../../core/auth/_services/teachingAttendant'
import { Student } from '../../../../core/auth/_models/students.model';
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'kt-student-attend',
  templateUrl: './student-attend.component.html',
  styleUrls: ['./student-attend.component.scss']
})
export class StudentAttendComponent implements OnInit {
  assignStudents: AssignStudent[]
  students: Student[]
  checked
  errorMessage;
  studentForm: FormGroup
  attendantStudent = []
  studentData: any[];
  constructor(
    public dialogRef: MatDialogRef<StudentAttendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TeachingAttendantService: TeachingAttendantService,
    private FB: FormBuilder,
  ) { }

  ngOnInit() {
    this.TeachingAttendantService.getStudentAttendant(this.data.data.groupID).subscribe(res => {
      if (res.result == true) {
        this.assignStudents = res.data
        this.students = res.students
      } else {
        this.errorMessage = res.message;
      }
    })
    this.studentForm = this.FB.group({
      students: this.FB.array([])
    })
  }
  onNoClick() {
    this.dialogRef.close();
  }
  async  sign() {
    
    await this.check();
    console.log(this.studentData)
    if(this.errorMessage&&this.errorMessage!=''){
      return
    }
    else{
      console.log('here')
      this.TeachingAttendantService.postStudentAttendant(this.studentData).subscribe(res=>{
        console.log(res)
        if(res.result==true){
          this.dialogRef.close({res})
        }else{
          this.errorMessage=res.message
        }
      })
    }
   
  }

  check(){
    this.studentData = [];
    if (this.attendantStudent && this.attendantStudent.length > 0) {
      console.log(this.attendantStudent)
      let object ={}
      this.attendantStudent.forEach(s => {
        object['assignStudentID'] = s
        object['groupID'] = this.data.data.groupID
        object['trackID']= this.data.data.trackID
        object['ip'] = this.data.data.ip
        this.studentData.push(object)
      })
      
    } else {
      this.errorMessage = 'Please select students'
      console.log(this.errorMessage)
      
    }
  }

  checkStudent(student, isChecked) {
    
    if (isChecked == true) {
      this.attendantStudent.push(student);
      
    } else {
      let index = this.attendantStudent.indexOf(student)
      this.attendantStudent.splice(index, 1)
    }
  }

  onClicked(s, $event) {
    console.log(s)
  }
  getStudentName(assignStudent: AssignStudent) {
    if (this.students) {
      let student = this.students.find(a => a.studentID === assignStudent.studentID)
      return student.fullNameEnglish
    }
  }

}

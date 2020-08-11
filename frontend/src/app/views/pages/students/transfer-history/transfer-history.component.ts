import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Course } from '../../../../core/auth/_models/Courses.model';
// Course 
import { CoursesService } from '../../../../core/auth/_services/courses.service';
@Component({
  selector: 'kt-transfer-history',
  templateUrl: './transfer-history.component.html',
  styleUrls: ['./transfer-history.component.scss']
})
export class TransferHistoryComponent implements OnInit {
  transfer;
  courses: Course[]=[];
  constructor(
    public dialogRef: MatDialogRef<TransferHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coursesService:CoursesService
  ) { }

  ngOnInit() {
    this.transfer = this.data.transfer
    this.getCourses()
  }
  getCourseName(id) {
    if (this.courses) {
      if (this.courses.length > 0) {
        const courses = this.courses.find(course => course.courseID === id)
        return courses.courseName
      }
    }
  }

  getCourses(){
    if(this.transfer&&this.transfer.length>0){
      this.transfer.forEach(element => {
        this.coursesService.getCourseByID(element.oldCourseID).subscribe(res=>{
          if(res.result==true){
            this.courses.push(res.data)
          }
        })

        this.coursesService.getCourseByID(element.newCourseID).subscribe(res=>{
          if(res.result==true){
            this.courses.push(res.data)
          }
        })
      });
    }
  
  }

}

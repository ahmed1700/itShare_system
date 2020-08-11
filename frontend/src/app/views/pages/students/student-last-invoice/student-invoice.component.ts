import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
//student
import { StudentService } from '../../../../core/auth/_services/students.sevice';
import { Student } from '../../../../core/auth/_models/students.model';

// Assign student
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';

//courses 
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

//payments
import { Payment } from '../../../../core/auth/_models/payment.model';
import { PaymentsService } from '../../../../core/auth/_services/payment.service'

//tracks
import { Track } from '../../../../core/auth/_models/Tracks.model';

//groups
import { GroupsService } from '../../../../core/auth/_services/group.service';

// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';

//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';




@Component({
  selector: 'kt-student-invoice',
  templateUrl: './student-invoice.component.html',
  styleUrls: ['./student-invoice.component.scss']
})


export class StudentInvoiceComponent implements OnInit, OnDestroy {
  courseDetails: Course;
  studentDetails: Student;
  assignStudentDetails: AssignStudent;
  paymentDetails: Payment;
  studentID;
  errorMessage;
  tracks: Track[] = [];
  remaining = 0;
  paid = 0;
  AssignStudent;
  cousreName;
  courseTracks = [];
  groupName;
  groupScheduel;
  invoiceDetails;
  assignStudentID;
  branchName;
  emloyeeName
  @ViewChild('billingFile', { static: true }) billingFile: ElementRef;

  private subscriptions: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<StudentInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private StudentService: StudentService,
    private CoursesService: CoursesService,
    private PaymentsService: PaymentsService,
    private cdr: ChangeDetectorRef,
    private EmployeesService: EmployeesService,
    private branchesService: branchesService,
    private GroupsService: GroupsService
  ) { }

  ngOnInit() {

    this.assignStudentDetails = this.data;
    this.assignStudentID = this.assignStudentDetails.assignStudentID;
    this.studentID = this.data.studentID;
    this.getAssignStudentDetails();
    this.getCourseInformation();
    this.getGroupInformation();
    this.getRemaining();
    this.getPaymentDetails();
  
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
 
  getAssignStudentDetails() {
    const student = this.StudentService.getStudentByID(this.studentID).subscribe(data => {
      if (data.result == true) {
        this.studentDetails = data.data;
        this.cdr.detectChanges();
      }

    }, error => {
      this.errorMessage = error.error
    })
    this.subscriptions.push(student)
  }


  getCourseInformation() {
    this.CoursesService.getCourseByID(this.data.courseID).subscribe(course => {

      if (course.result == true) {
        this.cousreName = course.data.courseName;
        let tracks = course.tracks
        this.courseTracks = tracks.map(track => track.trackName)
        if (this.assignStudentDetails.courseTracks) {
          this.assignStudentDetails.courseTracks.forEach(id => {
            let track = tracks.find(item => item.trackID === id.trackID)
            this.tracks.push(track)
          })
        }
      }
    });
  }
  getGroupInformation() {
    if (this.data.groupID) {
      let group = this.GroupsService.getGroupByID(this.data.groupID).subscribe(res => {
        if (res.result == true) {
          this.groupName = res.group.groupName;
          this.groupScheduel = res.group.groupSchedule;
        }

        this.subscriptions.push(group)
      });
    } else {
      this.groupName = 'Not Assigned to group';
      this.remaining = 0;
      this.paid = 0;
    }

  }

  getRemaining() {

    let payment = this.PaymentsService.findRemaining(this.assignStudentDetails.assignStudentID).subscribe(remaining => {
      this.remaining = remaining.remaingPayment;
      this.paid = this.data.totalPayment - this.remaining


    }, error => {
      this.errorMessage = error.error;
    })
    this.subscriptions.push(payment)
  }

  getPaymentDetails() {
    let payment = this.PaymentsService.getPaymentDetails(this.assignStudentDetails.assignStudentID).subscribe(res => {
      if (res.result == true) {

        for (let i = 0; i < res.data.length; i++) {
          this.invoiceDetails = res.data[res.data.length - 1];
         
          this.cdr.detectChanges();
        }

          this.getBranckName();
           this.getEmployeeName();
      }
    })
    this.subscriptions.push(payment)
  }

  getBranckName() {
    if (this.invoiceDetails) {
      this.branchesService.getBranchtByID(this.invoiceDetails.branchID).subscribe(res => {
        if (res.result == true) {
          this.branchName = res.data.name;
          this.cdr.detectChanges();
        }
      })
    }

  }

  getEmployeeName() {
    if (this.invoiceDetails) {
      this.EmployeesService.getemployeeByID(this.invoiceDetails.employeeID).subscribe(res => {
        if (res.result == true) {
          this.emloyeeName = res.data.fullNameEnglish
        }
      })
    }

  }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('billingFile').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>ITShare Invoice</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          <style>
          body {
            margin-top: 30px;
            margin-bottom: 30px;
        }
        .header-container{
          display: flex;
          justify-content: center;
          align-items:baseline;
      }
      
      .body-container{
          display: flex;
          justify-content: space-between;
          align-items:baseline;
          flex-wrap: nowrap;
          margin: 15px;
      }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  onAlertClose($event) {
    this.errorMessage = '';
  }

}  
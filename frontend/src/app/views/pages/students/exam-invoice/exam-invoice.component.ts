import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
//student
import { StudentService } from '../../../../core/auth/_services/students.sevice';
import { Student } from '../../../../core/auth/_models/students.model';


// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';

//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';

//Exams
import {examsService} from '../../../../core/auth/_services/exams.service';
@Component({
  selector: 'kt-exam-invoice',
  templateUrl: './exam-invoice.component.html',
  styleUrls: ['./exam-invoice.component.scss']
})
export class ExamInvoiceComponent implements OnInit, OnDestroy {
 
  studentDetails: Student;
  assignStudentDetails
  studentID;
  errorMessage;
  AssignStudent;
  examName;
  invoiceDetails;
  assignStudentID;
  branchName;
  emloyeeName
  @ViewChild('billingFile', { static: true }) billingFile: ElementRef;

  private subscriptions: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ExamInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private StudentService: StudentService,
    private cdr: ChangeDetectorRef,
    private EmployeesService: EmployeesService,
    private branchesService: branchesService,
    private examService:examsService
  ) { }

  ngOnInit() {

    this.assignStudentDetails = this.data;
    this.assignStudentID = this.assignStudentDetails.studentExamID;
    this.studentID = this.data.studentID;
    this.getBranckName()
    this.getEmployeeName()
    this.getAssignStudentDetails();
    this.getExamInformation();
     
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
 

  getExamInformation() {
    this.examService.getExamByID(this.data.examID).subscribe(exam => {

      if (exam.result == true) {
        this.examName = exam.data.examName;
        
      }
    });
  }
  
  
  getBranckName() {
    if (this.assignStudentDetails) {
      this.branchesService.getBranchtByID(this.assignStudentDetails.branchID).subscribe(res => {
        if (res.result == true) {
          this.branchName = res.data.name;
          this.cdr.detectChanges();
        }
      })
    }

  }

  getEmployeeName() {
    if (this.assignStudentDetails) {
      this.EmployeesService.getemployeeByID(this.assignStudentDetails.employeeID).subscribe(res => {
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

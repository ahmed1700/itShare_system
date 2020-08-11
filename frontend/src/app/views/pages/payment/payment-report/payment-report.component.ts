import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { Payment } from '../../../../core/auth/_models/payment.model';
import { Branch } from '../../../../core/auth/_models/branches.model';
import { Employee } from '../../../../core/auth/_models/employees.model';
import { Student } from '../../../../core/auth/_models/students.model';


 
@Component({
  selector: 'kt-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  allPayments: Payment[] = []
  noPayment
  allEmployees: Employee[];
  allBranches: Branch[];
  students:Student[]=[]
  totalPaid = 0;
  totalRefund = 0;
  start_day;
  end_date;
  branch

  constructor(
    public dialogRef: MatDialogRef<PaymentReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.allPayments = this.data.payment;
    this.start_day = this.data.start_date;
    if (this.data.end_date) {
      this.end_date = this.data.end_date
    }
    if (this.data.branch) {
      this.branch = this.data.branch
    }
    
    if (this.allPayments) {
      if (this.allPayments.length == 0) {
        this.noPayment = 'There is no payments for this day'
      } else {
        let paidPayment = this.allPayments.filter(pay => pay.tranactionType === 'in');
        this.totalPaid = paidPayment.reduce((a, b) => +a + +b.paid, 0);
        let refundPayment = this.allPayments.filter(pay => pay.tranactionType === 'out');
        this.totalRefund = refundPayment.reduce((a, b) => +a + +b.paid, 0);
      }
    }
    this.allEmployees = this.data.employees;
    this.allBranches = this.data.branches
    this.students=this.data.students
  }
  getEmployeeName(id) {
    if (this.allEmployees) {
      if (this.allEmployees.length > 0) {
        const employees = this.allEmployees.find(employee => employee.employeeID === id)
        return employees.fullNameEnglish
      }
    }
  }

  getBranchName(id) {
    if (this.allBranches) {
      if (this.allBranches.length > 0) {
        const branches = this.allBranches.find(branch => branch.branchID === id)
        return branches.name
      }
    }
  }

  getStudentName(id) {
    if (this.students) {
      if (this.students.length > 0) {
        const students = this.students.find(student => student.studentID === id)
        return students.fullNameEnglish
      }
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
        
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}

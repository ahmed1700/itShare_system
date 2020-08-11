import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort ,MatDialog} from '@angular/material';
import { Subscription } from 'rxjs';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { FormBuilder } from '@angular/forms';
import { ExamPaymentReportComponent } from '../exam-payment-report/exam-payment-report.component'

import { ExamStudent } from '../../../../core/auth/_models/student_exam.model';
import { examsService } from '../../../../core/auth/_services/exams.service';
// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';
import { Employee } from '../../../../core/auth/_models/employees.model';

// student
import { StudentService } from '../../../../core/auth/_services/students.sevice';
//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';
 //student
 import { Student } from '../../../../core/auth/_models/students.model';
@Component({
  selector: 'kt-exam-payment',
  templateUrl: './exam-payment.component.html',
  styleUrls: ['./exam-payment.component.scss']
})
export class ExamPaymentComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['paymentID', 'studentID','studentName', 'employee', 'branch', 'paid', 'creationDate', 'paymentType'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paymentList: ExamStudent[];
  allEmployees: Employee[] = [];
  allBranches: Branch[] = [];
  students:Student[]=[]
  branchID
  payment = []
  isAdmin: boolean;
  filterPayment;
  selectedBranch = 0
  end_date;
  start_date;
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private PaymentsService: examsService,
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private EmployeesService: EmployeesService,

    private StudentService: StudentService,
    private branchesService: branchesService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
      this.isAdmin = true
    } else {
      this.selectedBranch = JSON.parse(localStorage.getItem('currentUser')).branchID
      this.isAdmin = false
    }
    
    this.loadPayment();
    


  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  getAllEmployees() {
    if (this.paymentList && this.paymentList.length > 0) {
      let employeesID = this.paymentList.map(e => e.employeeID);
      employeesID.forEach(employee => {
        let employees = this.EmployeesService.getemployeeByID(employee).subscribe(res => {
          if (res.result == true) {
            this.allEmployees.push(res.data);
            this.cdr.detectChanges();
          }
        })
        this.subscriptions.push(employees);
      })
    }

  }

  getAllBranches() {
    if (this.paymentList && this.paymentList.length > 0) {
      if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
        let branches = this.branchesService.getBranches().subscribe(res => {
          if (res.result == true) {
            this.allBranches = res.data;
            this.cdr.detectChanges()
          }
        })
        this.subscriptions.push(branches)
      } else {
        let branchID = JSON.parse(localStorage.getItem('currentUser')).branchID;
        let branches = this.branchesService.getBranchtByID(branchID).subscribe(res => {
          if (res.result == true) {
            this.allBranches.push(res.data);
            this.cdr.detectChanges()
          }
        })
        this.subscriptions.push(branches)

      }
    }
  } 

  loadPayment() {
    if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin') {
      this.branchID = JSON.parse(localStorage.getItem('currentUser')).branchID;
      let date = new Date();
      const payments = this.PaymentsService.getPaymentForEmployee(this.branchID , date).subscribe(res => {
        if (res.result) {
          this.paymentList = res.data;
          this.allBranches = res.branch;
          this.allEmployees = res.employees;
          this.students=res.students
          this.dataSource = new MatTableDataSource<ExamStudent>(this.paymentList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      })
      this.subscriptions.push(payments)
    } else {
      const payments = this.PaymentsService.getAssignExams().subscribe(res => {
        if (res.result) {
          this.paymentList = res.data;
          this.allBranches = res.branch;
          this.allEmployees = res.employees;
          this.students=res.students;
          this.filterByPramters()
          this.dataSource = new MatTableDataSource<ExamStudent>(this.paymentList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      })
      this.subscriptions.push(payments)
    }
    

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getBranchName(id) {
    if (this.allBranches&&this.paymentList) {
      if (this.allBranches.length > 0) {
        const branches = this.allBranches.find(branch => branch.branchID === id)
        return branches.name
      }
    }
  }



  getEmployeeName(id) {
    if (this.allEmployees&&this.paymentList) {
      if (this.allEmployees.length > 0) {
        const employees = this.allEmployees.find(employee => employee.employeeID === id);
        return employees.fullNameEnglish
      }
    }
  }

  getStudentName(id) {
    if (this.students && this.paymentList) {
      if (this.students.length > 0) {
        const students = this.students.find(student => student.studentID === id)
        return students.fullNameEnglish
      }
    }
  }

  findPayment() {
    if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin') {
      const dialogRef = this.dialog.open(ExamPaymentReportComponent, {
        data: { payment: this.paymentList, 'start_date': this.start_date, 'branch': this.branchID, 'employees': this.allEmployees, 'branches': this.allBranches,students:this.students }, height: '500px',
        width: '1000px',
      });
    }else{
      if(this.filterPayment&&this.filterPayment.length>0){
        const dialogRef = this.dialog.open(ExamPaymentReportComponent, {
          data: { payment: this.filterPayment, 'start_date': this.start_date, 'branch': this.branchID, 'employees': this.allEmployees, 'branches': this.allBranches,students:this.students }, height: '500px',
          width: '1000px',
        });
      }else{
        const dialogRef = this.dialog.open(ExamPaymentReportComponent, {
          data: { payment: this.paymentList, 'start_date': this.start_date, 'branch': this.branchID, 'employees': this.allEmployees, 'branches': this.allBranches,students:this.students }, height: '500px',
          width: '1000px',
        });
      }
    }
  
  }
  filterByPramters() {
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
      this.filterPayment = this.paymentList
      if (this.selectedBranch == 0 && !this.start_date && !this.end_date) {
        this.dataSource = new MatTableDataSource<ExamStudent>(this.filterPayment);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch != 0 && this.start_date && this.end_date) {
        this.filterPayment = this.filterPayment.filter(p =>
          p.branchID == this.selectedBranch && new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<ExamStudent>(this.filterPayment)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }

      else if (this.selectedBranch == 0 && this.start_date && this.end_date) {
        this.filterPayment = this.filterPayment.filter(p => new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<ExamStudent>(this.filterPayment)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch != 0 || this.start_date || this.end_date) {
        if (this.selectedBranch != 0) {
          this.filterPayment = this.filterPayment.filter(p => p.branchID == this.selectedBranch);

        }
        if (this.start_date) {
          this.filterPayment = this.filterPayment.filter(p => new Date(p.creationDate).toDateString() == this.start_date.toDateString());

        } if (this.end_date) {
          this.filterPayment = this.filterPayment.filter(p =>
            new Date(p.creationDate).toDateString() == this.end_date.toDateString());
        }
        this.dataSource = new MatTableDataSource<ExamStudent>(this.filterPayment);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();

      }
    } else {
      let date = this.start_date;
      const payments = this.PaymentsService.getPaymentForEmployee(this.branchID, date).subscribe(res => {
        if (res.result) {
          this.paymentList = res.data;
          this.dataSource = new MatTableDataSource<ExamStudent>(this.paymentList);
          this.allBranches = res.branch;
          this.allEmployees = res.employees;
          this.students=res.students
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      })
      this.subscriptions.push(payments)
    }
  }
}

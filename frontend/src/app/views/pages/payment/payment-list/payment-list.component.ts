import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort,MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { PaymentReportComponent } from '../payment-report/payment-report.component'

//payments
import { Payment } from '../../../../core/auth/_models/payment.model';
import { PaymentsService } from '../../../../core/auth/_services/payment.service';

// Employees
import { Employee } from '../../../../core/auth/_models/employees.model';

//branches
import { Branch } from '../../../../core/auth/_models/branches.model';
   //student
import { Student } from '../../../../core/auth/_models/students.model';

  
@Component({
  selector: 'kt-payment-list',
  templateUrl: './payment-list.component.html',

})
export class PaymentListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['paymentID', 'studentID', 'studentName','employee', 'branch', 'paid', 'creationDate', 'paymentType', 'tranactionType'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paymentList: Payment[];
  allEmployees: Employee[] = []; 
  allBranches: Branch[] = [];
  students:Student[]=[]
  payment = [];
  branchID
  isAdmin: boolean;
  filterPayment;
  selectedBranch = 0
  end_date;
  start_date;
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private PaymentsService: PaymentsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
      this.isAdmin = true
    } else {
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

  loadPayment() {
    this.start_date = new Date();
    this.end_date = new Date();
    if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin') {
      this.branchID = JSON.parse(localStorage.getItem('currentUser')).branchID;
      let date = new Date();
      const payments = this.PaymentsService.getExamPaymentForEmployee(this.branchID, date).subscribe(res => {
        if (res.result) {
          this.paymentList = res.data;
          this.allBranches = res.branch;
          this.allEmployees = res.employees;
          this.students=res.students;
          this.dataSource = new MatTableDataSource<Payment>(this.paymentList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        } 
      })
      this.subscriptions.push(payments)
    } else {
      const payments = this.PaymentsService.getPayments().subscribe(res => {
        if (res.result) {
          this.paymentList = res.data;
          this.allBranches = res.branch;
          this.allEmployees = res.employees;
          this.students=res.students
          this.filterByPramters()
          this.dataSource = new MatTableDataSource<Payment>(this.paymentList);
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
    if (this.allBranches && this.paymentList) {
      if (this.allBranches.length > 0) {
        const branches = this.allBranches.find(branch => branch.branchID === id)
        return branches.name
      }
    }
  }


  getEmployeeName(id) {
    if (this.allEmployees && this.paymentList) {
      if (this.allEmployees.length > 0) {
        const employees = this.allEmployees.find(employee => employee.employeeID === id)
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
      const dialogRef = this.dialog.open(PaymentReportComponent, {
        data: { payment: this.paymentList, 'start_date': this.start_date, 'employees': this.allEmployees, 'branch': this.branchID, 'branches': this.allBranches,students:this.students }, height: '500px',
        width: '1200px',
      });
    } else {
      if(this.filterPayment){
        const dialogRef = this.dialog.open(PaymentReportComponent, {
          data: { payment: this.filterPayment, 'start_date': this.start_date, 'end_date': this.end_date, 'branch': this.selectedBranch, 'employees': this.allEmployees, 'branches': this.allBranches,students:this.students  }, height: '500px',
          width: '1200px',
        });
      }else{
        const dialogRef = this.dialog.open(PaymentReportComponent, {
          data: { payment: this.paymentList, 'start_date': this.start_date, 'end_date': this.end_date, 'branch': this.selectedBranch, 'employees': this.allEmployees, 'branches': this.allBranches,students:this.students  }, height: '500px',
          width: '1200px',
        });
      }
     
    }

  }
  filterByPramters() {
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
      this.filterPayment = this.paymentList
      if (this.selectedBranch == 0 && !this.start_date && !this.end_date) {
        this.dataSource = new MatTableDataSource<Payment>(this.filterPayment);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch != 0 && this.start_date && this.end_date) {
        this.filterPayment = this.filterPayment.filter(p =>
          p.branchID == this.selectedBranch && new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<Payment>(this.filterPayment)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }

      else if (this.selectedBranch == 0 && this.start_date && this.end_date) {
        this.filterPayment = this.filterPayment.filter(p => new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<Payment>(this.filterPayment)
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
        this.dataSource = new MatTableDataSource<Payment>(this.filterPayment);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges(); 
      }
    } else {
      let date = this.start_date;
      const payments = this.PaymentsService.getExamPaymentForEmployee(this.branchID, date).subscribe(res => {
        if (res.result) {
          this.paymentList = res.data;
          this.dataSource = new MatTableDataSource<Payment>(this.paymentList);
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

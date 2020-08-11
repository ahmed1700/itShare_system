import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material';

import { PublicPaymentPdfComponent } from '../public-payment-pdf/public-payment-pdf.component';
import { ActivatedRoute, Router } from '@angular/router';

 
// Employees
import { Employee } from '../../../../core/auth/_models/employees.model';

//PublicPayment

import { PublicPayment } from '../../../../core/auth/_models/public-payment.model';
import { publicPaymentService } from '../../../../core/auth/_services/publicPayment.service';


//branches
import { Branch } from '../../../../core/auth/_models/branches.model';
import { ShowDetailsComponent } from '../show-details/show-details.component';


@Component({
  selector: 'kt-public-payment-list',
  templateUrl: './public-payment-list.component.html',
  styleUrls: ['./public-payment-list.component.scss']
})
export class PublicPaymentListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['publicPaymentID', 'category', 'employee', 'branch', 'paid', 'tranactionType', 'creationDate','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  PublicPaymentList: PublicPayment[];
  allEmployees: Employee[] = [];
  allBranches: Branch[] = [];
  allCategories: [{ 'categoryID': number, 'categoryName': string }] = [{ 'categoryID': 0, 'categoryName': '' }]
  PublicPayment = []
  isAdmin: boolean;
  filterPublicPayment;
  branchID
  selectedBranch = 0
  selectedCategory = 0
  end_date;
  start_date;
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private PublicPaymentsService: publicPaymentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }

    this.loadPublicPayment();
  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  loadPublicPayment() {
    this.start_date = new Date();
    this.end_date = new Date();
    if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin') {
      this.branchID = JSON.parse(localStorage.getItem('currentUser')).branchID;
      let date = new Date();
      const payments = this.PublicPaymentsService.getPublicPaymentForEmployee(this.branchID, date).subscribe(res => {
        if (res.result) {
          this.PublicPaymentList = res.data;
           this.allCategories=res.categories
          this.allBranches = res.branch;
          this.allEmployees = res.employees;
          this.dataSource = new MatTableDataSource<PublicPayment>(this.PublicPaymentList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      })
      this.subscriptions.push(payments)
    } else {
      const payments = this.PublicPaymentsService.getPublicPayment().subscribe(res => {
        if (res.result) {
          this.PublicPaymentList = res.data;
          this.allCategories=res.categories
          this.allBranches = res.branch;
          this.allEmployees = res.employees;
          this.dataSource = new MatTableDataSource<PublicPayment>(this.PublicPaymentList);
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
    if (this.allBranches) {
      if (this.allBranches.length > 0) {
        const branches = this.allBranches.find(branch => branch.branchID === id)
        return branches.name
      }
    }
  }

  getCategoryName(id) {
    if (this.allCategories) {
      if (this.allCategories.length > 0) {
        const categories = this.allCategories.find(category => category.categoryID === id)
        return categories.categoryName
      }
    }
  }

  getEmployeeName(id) {
    if (this.allEmployees) {
      if (this.allEmployees.length > 0) {
        const employees = this.allEmployees.find(employee => employee.employeeID === id)
        return employees.fullNameEnglish
      }
    }
  }

  findpayment() {
    if (JSON.parse(localStorage.getItem('currentUser')).role != 'Admin') {
      const dialogRef = this.dialog.open(PublicPaymentPdfComponent, {
        data: { PublicPayment: this.PublicPaymentList, 'start_date': this.start_date, 'branch': this.selectedBranch, 'employees': this.allEmployees, 'branches': this.allBranches, 'categoris': this.allCategories }, height: '500px',
        width: '1000px',
      });
    }else{
      if(this.filterPublicPayment){
        const dialogRef = this.dialog.open(PublicPaymentPdfComponent, {
          data: { PublicPayment: this.filterPublicPayment, 'start_date': this.start_date,'end_date':this.end_date, 'branch': this.selectedBranch, 'employees': this.allEmployees, 'branches': this.allBranches, 'categoris': this.allCategories }, height: '500px',
          width: '1000px',
        });
      }else{
        const dialogRef = this.dialog.open(PublicPaymentPdfComponent, {
          data: { PublicPayment: this.PublicPaymentList, 'start_date': this.start_date,'end_date':this.end_date, 'branch': this.selectedBranch, 'employees': this.allEmployees, 'branches': this.allBranches, 'categoris': this.allCategories }, height: '500px',
          width: '1000px',
        });
      }
    }


  }
  filterByPramters() {
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
      this.filterPublicPayment = this.PublicPaymentList
      if (this.selectedBranch == 0 && !this.start_date && !this.end_date && this.selectedCategory == 0) {
        this.dataSource = new MatTableDataSource<PublicPayment>(this.filterPublicPayment);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch != 0 && this.start_date && this.end_date && this.selectedCategory == 0) {
        this.filterPublicPayment = this.filterPublicPayment.filter(p =>
          p.branchID == this.selectedBranch &&  new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<PublicPayment>(this.filterPublicPayment)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch != 0 && this.start_date && this.end_date && this.selectedCategory != 0) {
        this.filterPublicPayment = this.filterPublicPayment.filter(p =>p.categoryID == this.selectedCategory &&
          p.branchID == this.selectedBranch &&  new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<PublicPayment>(this.filterPublicPayment)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch == 0 && this.start_date && this.end_date && this.selectedCategory != 0) {
        this.filterPublicPayment = this.filterPublicPayment.filter(p =>p.categoryID == this.selectedCategory &&
           new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<PublicPayment>(this.filterPublicPayment)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch == 0 && this.start_date && this.end_date && this.selectedCategory == 0) {
        this.filterPublicPayment = this.filterPublicPayment.filter(p =>
           new Date(this.start_date)
          <= new Date(p.creationDate) && new Date(p.creationDate) <= new Date(this.end_date))
        this.dataSource = new MatTableDataSource<PublicPayment>(this.filterPublicPayment)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
      else if (this.selectedBranch != 0 || this.start_date || this.end_date || this.selectedCategory != 0) {
        if (this.selectedBranch != 0) {
          this.filterPublicPayment = this.filterPublicPayment.filter(p => p.branchID == this.selectedBranch);
        }
        if (this.selectedCategory != 0) {
          this.filterPublicPayment = this.filterPublicPayment.filter(p => p.categoryID == this.selectedCategory);
        } 
        if (this.start_date) {
          this.filterPublicPayment = this.filterPublicPayment.filter(p => new Date(p.creationDate).toDateString() == this.start_date.toDateString());
        } if (this.end_date) {
          this.filterPublicPayment = this.filterPublicPayment.filter(p =>
            new Date(p.creationDate).toDateString() == this.end_date.toDateString());
        }
        this.dataSource = new MatTableDataSource<PublicPayment>(this.filterPublicPayment);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      }
    } else {
      let date = this.start_date;
      const payments = this.PublicPaymentsService.getPublicPaymentForEmployee(this.branchID, date).subscribe(res => {
        if (res.result) {
          this.PublicPaymentList = res.data;
          this.dataSource = new MatTableDataSource<PublicPayment>(this.PublicPaymentList);
          this.allCategories=res.categories
          this.allEmployees = res.employees;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      })
      this.subscriptions.push(payments)
    }
  }


  editExam(id) {
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }

  showDetails(payment:PublicPayment){
    this.dialog.open(ShowDetailsComponent, {
      data: payment.categoryDetails, height: '300px',
      width: '800px',
    });
  }

}

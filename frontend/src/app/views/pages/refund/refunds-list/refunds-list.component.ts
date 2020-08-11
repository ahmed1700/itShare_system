import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort , MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import {PaymentsService} from '../../../../core/auth/_services/payment.service';
import {RefundsEditComponent} from '../refunds-edit/refunds-edit.component';

// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';
import { Employee } from '../../../../core/auth/_models/employees.model';

// Course
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';
 
@Component({
  selector: 'kt-refunds-list',
  templateUrl: './refunds-list.component.html',
  styleUrls: ['./refunds-list.component.scss']
})
export class RefundsListComponent implements OnInit , OnDestroy {

  dataSource: MatTableDataSource<any>;
  displayedColumns = [ 'ID', 'studentID', 'assignStudentID','employeeID' ,'courseID', 'paid','date','status','comment','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  refunds:[];
  isAdmin: boolean;
  allEmployees: Employee[];
  courses: Course[];
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private PaymentsService:PaymentsService,
    private dialog:MatDialog,
    private EmployeesService: EmployeesService,
    private CoursesService: CoursesService,
  ) { }

  ngOnInit() { 
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
		} else {
			this.isAdmin = false  
    } 
    this.getCourses()
    this.getAllEmployees();
    this.loadRefundList();
    
  }  

  getAllEmployees() {
    let employees = this.EmployeesService.getemployees().subscribe(res => {
      if (res.result == true) {
        this.allEmployees = res.data;
      }
    })
    this.subscriptions.push(employees)
  }
 

  getEmployeeName(id) {
    if (this.allEmployees) {
      if (this.allEmployees.length > 0) {
        const employees = this.allEmployees.find(employee => employee.employeeID === id)
        return employees.fullNameEnglish
      }
    }
  }

  getCourses() {
    let courses = this.CoursesService.getCourses().subscribe(res => {
      if (res.result == true) {
        this.courses = res.data;
      }
    });
  }


  getCourseName(id) {
    if (this.courses) {
      if (this.courses.length > 0) {
        const courses = this.courses.find(course => course.courseID === id)
        return courses.courseName
      }
    }
  }
  


  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  

  


  loadRefundList() {
   
    const attendant = this.PaymentsService.getRefunds().subscribe(res => {
      if (res.result == true) {
        this.refunds = res.data;
       
        this.dataSource = new MatTableDataSource<any>(this.refunds);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
      }
      
    }, error => {
      console.log(error.error)
    }
    )
    this.subscriptions.push(attendant)
   
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  
  

   
	/**
	 * Toggle selection
	 */
 

  editRefund(id){
    const dialogRef = this.dialog.open(RefundsEditComponent, {
			data: id,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification('Status Updated Succefully');
        this.loadRefundList()

		})
  }



}

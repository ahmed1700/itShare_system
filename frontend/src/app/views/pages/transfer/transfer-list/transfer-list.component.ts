import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort , MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import {TransferService} from '../../../../core/auth/_services/transfer';
import {TransferEditComponent} from '../transfer-edit/transfer-edit.component';
// Course
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';
import { Employee } from '../../../../core/auth/_models/employees.model';

@Component({ 
  selector: 'kt-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit , OnDestroy { 

  dataSource: MatTableDataSource<any>;
  displayedColumns = [ 'ID', 'assignStudentID','employeeID' ,'oldCourseID','newCourseID','newTotalPayment','date','status','comment','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  transfers:[]
  isAdmin: boolean;
  courses: Course[];
  allEmployees: Employee[];
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private TransferService:TransferService,
    private dialog:MatDialog,
    private CoursesService: CoursesService,
    private EmployeesService: EmployeesService,
  ) { }

  ngOnInit() { 
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
		} else {
			this.isAdmin = false 
		} 
    this.getAllEmployees()  
    this.loadtransferList();
    this.getCourses()
    
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

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  

  


  loadtransferList() {
   
    const attendant = this.TransferService.transferPermissionRequest().subscribe(res => {
      if (res.result == true) {
        this.transfers = res.data;
       
        this.dataSource = new MatTableDataSource<any>(this.transfers);
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
 

  edittransfer(id){
    const dialogRef = this.dialog.open(TransferEditComponent, {
			data: id,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification('Status Updated Succefully');
        this.loadtransferList()

		})
  }



}

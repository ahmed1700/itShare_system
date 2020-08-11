import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';

// Assign student
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';
import { AssignStudentService } from '../../../../core/auth/_services/assignStudent.service';

// Course
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';

// student
import { StudentService } from '../../../../core/auth/_services/students.sevice';
//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';


@Component({
  selector: 'kt-assig-student-list',
  templateUrl: './assig-student-list.component.html',
 
})
export class AssigStudentListComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<AssignStudent>;
  displayedColumns = ['select', 'assignStudentID', 'studentID', 'course', 'branch', 'date', 'status', 'totalPayment'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  assignStudentList: AssignStudent[];
  assignStudentListFilter: AssignStudent[];
  selection = new SelectionModel<AssignStudent>(true, []);
  branchName;
  studentName;
  courses: Course[];
  selectedcourse = 0;
  allBranches: Branch[];
  selectedBranch = 0;
  date; 
  AllStatus = ['waiting', 'pending', 'working', 'finished'];
  selectedStatus = "0";
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private CoursesService: CoursesService,
    private EmployeesService: EmployeesService,
    private AssignStudentService: AssignStudentService,
    private StudentService: StudentService,
    private branchesService: branchesService
  ) { }

  ngOnInit() { 
    this.getAllBranches()
    this.getCourses()
    this.loadSudent();
    
  }  

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  getCourses() {
    let courses = this.CoursesService.getCourses().subscribe(res => {
      if (res.result == true) {
        this.courses = res.data;
      }
    });
  }

  getAllBranches() {
    let branches = this.branchesService.getBranches().subscribe(res => {
      if (res.result == true) {
        this.allBranches = res.data;
      }
    })
    this.subscriptions.push(branches)
  }


  loadSudent() {
    this.selection.clear();
    const payments = this.AssignStudentService.getAllAssignedStudents().subscribe(res => {
      if (res.result == true) {
        this.assignStudentList = res.data;
        this.assignStudentListFilter = this.assignStudentList;
      }
      this.dataSource = new MatTableDataSource<AssignStudent>(this.assignStudentList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    }, error => {
      console.log(error.error)
    }
    )
    this.subscriptions.push(payments)
    this.selection.clear();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  fetchstudents() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      let employeeName
      let branchName
      let studentName
      this.EmployeesService.getemployeeByID(elem.employeeID).subscribe(res => {
        employeeName = res.fullNameEnglish
        this.StudentService.getStudentByID(elem.studentID).subscribe(studentData => {
          studentName = studentData.fullNameEnglish
          this.branchesService.getBranchtByID(elem.branchID).subscribe(branch => {
            branchName = branch.name
            messages.push({
              text: `EmployeeID:${elem.employeeID},-EmployeeName:${employeeName}-AssignStudentID: ${elem.studentID}-studentName:${studentName},-branch:${branchName}`,
            });
          })
        })

      })
    });
    this.layoutUtilsService.fetchElements(messages);
  }
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.assignStudentList.length;
    return numSelected === numRows;
  }

	/**
	 * Toggle selection
	 */
  masterToggle() {
    if (this.selection.selected.length === this.assignStudentList.length) {
      this.selection.clear();
    } else {
      this.assignStudentList.forEach(row => this.selection.select(row));
    }
  }

  getCourseName(id) {
    if (this.courses) {
      if (this.courses.length > 0) {
        const courses = this.courses.find(course => course.courseID === id)
        return courses.courseName
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
  filterByPramters() {
    this.assignStudentListFilter = this.assignStudentList
    if (this.selectedBranch == 0 && this.selectedcourse == 0 && this.selectedStatus == '0' && !this.date) {
      this.dataSource = new MatTableDataSource<AssignStudent>(this.assignStudentListFilter);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    }
    else if (this.selectedBranch != 0 && this.selectedcourse != 0 && this.selectedStatus != '0' && this.date) {
      console.log('6')
      this.dataSource = new MatTableDataSource<AssignStudent>(this.assignStudentListFilter.filter(p =>
        p.branchID == this.selectedBranch && p.status == this.selectedStatus && p.courseID == this.selectedcourse &&
        new Date(p.creationDate).toDateString() == this.date.toDateString()));
     
    }
    else if (this.selectedBranch != 0 || this.selectedcourse !== 0 || this.selectedStatus != '0' || this.date) {

      if (this.selectedBranch != 0) {
        this.assignStudentListFilter = this.assignStudentListFilter.filter(p => p.branchID == this.selectedBranch);
        
      }
      if (this.selectedcourse != 0) {
        this.assignStudentListFilter = this.assignStudentListFilter.filter(p => p.courseID == this.selectedcourse);
      }
      if (this.selectedStatus != '0') {
        this.assignStudentListFilter = this.assignStudentListFilter.filter(p => p.status == this.selectedStatus);
        this.dataSource = new MatTableDataSource<AssignStudent>(this.assignStudentListFilter)
      } if (this.date) {
        this.assignStudentListFilter = this.assignStudentListFilter.filter(p =>
          new Date(p.creationDate).toDateString() == this.date.toDateString());
      }
      this.dataSource = new MatTableDataSource<AssignStudent>(this.assignStudentListFilter);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();

    }

  }

}

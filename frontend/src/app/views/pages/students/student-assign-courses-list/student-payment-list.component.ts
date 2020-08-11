import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';

// Assign student
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';
import { AssignStudentService } from '../../../../core/auth/_services/assignStudent.service';

// Course 
import { CoursesService } from '../../../../core/auth/_services/courses.service';

//groups
import { MatDialog } from '@angular/material';
import { GroupsService } from '../../../../core/auth/_services/group.service';


import { StudentInvoiceComponent } from '../student-last-invoice/student-invoice.component'
import { AssignStudentComponent } from '../assign-student-to-course-form/assign-student.component';
import { TransferService } from '../../../../core/auth/_services/transfer'
import { TransferHistoryComponent } from '../transfer-history/transfer-history.component';
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component';
import { StudentAttendantComponent } from '../student-attendant/student-attendant.component';

@Component({
  selector: 'kt-student-payment-list',
  templateUrl: './student-payment-list.component.html',

})
export class StudentPaymentListComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<AssignStudent>;
  displayedColumns = ['assignStudentID', 'course', 'group', 'status', 'totalPayment', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  assignStudentList: AssignStudent[] = [];
  selection = new SelectionModel<AssignStudent>(true, []);
  branchName;
  studentName;
  coursesList = [];
  groupList;
  studentID;
  transfer;
  coursesID
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private CoursesService: CoursesService,
    private AssignStudentService: AssignStudentService,
    private activatedRoute: ActivatedRoute,
    private GroupsService: GroupsService,
    public dialog: MatDialog,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private TransferService: TransferService
  ) { }

  ngOnInit() {

    this.loadSudent();
  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  loadSudent() {
    this.selection.clear();
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      this.studentID = params['id'];
      this.AssignStudentService.getAssinStudent(params['id']).subscribe(res => {

        if (res.result == true) {
          if (res.data.length > 0) {
            this.assignStudentList = res.data;
            this.coursesList=res.courses
            this.groupList=res.groups
            this.dataSource = new MatTableDataSource<AssignStudent>(this.assignStudentList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.cdr.detectChanges();
          }

        }
      }, error => {

      }
      )
    })
    this.subscriptions.push(routeSubscription)
    this.selection.clear();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }




  getCourseName(id) {
    if (this.coursesList) {
      if (this.coursesList.length > 0) {
        const courses = this.coursesList.find(course => course.courseID === id)
        return courses.courseName
      }
    }
  }
  getGroupName(id) {
    if (this.groupList) {
      if (this.groupList.length > 0) {

        const groups = this.groupList.find(group => group.groupID === id)
        if (groups) { return groups.groupName }
        else { return 'Not Assigned to group' }
      }
    }
  } 

  showStudentAttendant(id){
     console.log(id)
     this.dialog.open(StudentAttendantComponent, {
      data: id, height: '300px',
      width: '800px',
    });
  } 
 

  viewStudentBilling(student) {
    this.dialog.open(StudentInvoiceComponent, {
      data: student,
      height: '800px',
      width: '1000px',
    });
  }

  EditAssign(student) {
    const dialogRef = this.dialog.open(AssignStudentComponent, {
      data: { student: student, studentID: this.studentID }, height: '500px',
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification('Student has been succefully assigned');
      this.loadSudent()
    })
  }


  RemoveStudentFromGroup(student:AssignStudent) {
    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Delete Student From Group', 'message': ' Are you sure you want to Delete Student From Group?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.AssignStudentService.removeStudentFromGroup(student.assignStudentID).subscribe(res=>{
        if(res==true){
          this.layoutUtilsService.showActionNotification('Student has been succefully removed from group');
          this.loadSudent()
        }
      })
      
    })
  }


  NewAssign() {
    let student = new AssignStudent();
    this.EditAssign(student)

  }
  moveToPayment() {
    this.router.navigateByUrl(`/students/payments/${this.studentID}`);
  }
   
  viewEditHistory(student) {
    this.isEdited(student)
    if (this.transfer) {
      this.dialog.open(TransferHistoryComponent, {
        data: { transfer: this.transfer, courses: this.coursesList }, height: '300px',
        width: '800px',
      });
    }

  }

  isEdited(student: AssignStudent) {
    this.TransferService.getStudentTansfer(student.assignStudentID).subscribe(res => {

      if (res.result == true) {
        this.transfer = res.data;

        this.cdr.detectChanges();
      }
    })
  }


}

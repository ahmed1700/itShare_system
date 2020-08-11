import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog} from '@angular/material';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import {InvoiceEveryPaymentComponent} from '../invoice-every-payment/invoice-every-payment.component'



//payments
import { Payment } from '../../../../core/auth/_models/payment.model';
import { PaymentsService } from '../../../../core/auth/_services/payment.service';

// Course
import {CoursesService} from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';


      //add payment
import{StudentPaymentComponent } from '../student-payment-form/student-payment.component';


@Component({
  selector: 'kt-student-all-payments',
  templateUrl: './student-all-payments.component.html',
})
export class StudentAllPaymentsComponent implements OnInit , OnDestroy {

  dataSource: MatTableDataSource<Payment>;
  displayedColumns = ['paymentID','assignStudentID','paid','paymentType','course','date','time','tranactionType','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paymentList: Payment[];
  studentID;
  courseList:Course[];

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private PaymentsService:PaymentsService,
    public dialog: MatDialog,
    private CoursesService:CoursesService,
    private router:Router,
    private layoutUtilsService:LayoutUtilsService
  ) { }

  ngOnInit() {
  
    this.loadSudentPayment();
    this.getCoursesList();
  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  getCoursesList(){
    const courses=this.CoursesService.getCoursesByStudent(this.studentID).subscribe(res=>{
      if(res.result==true){
        this.courseList=res.data;
        this.cdr.detectChanges();
      }
    })
    this.subscriptions.push(courses);
  }

  loadSudentPayment() {
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
       this.studentID=params['id'];
      this.PaymentsService.getStudentAllPayment(params['id']).subscribe(res=>{
        if(res.result==true){
          this.paymentList=res.data;
          this.dataSource = new MatTableDataSource<Payment>(this.paymentList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      })
		      
    })
  
    this.subscriptions.push(routeSubscription )
  }

  addNewPayment(){
    const dialogRef=  this.dialog.open(StudentPaymentComponent , { data:this.studentID});
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
				return; 
			}
			this.layoutUtilsService.showActionNotification('Student has been succefully assigned');
		   this.loadSudentPayment()
      })
  } 


  getCourseName(id){
    if (this.courseList) {
			if (this.courseList.length > 0) {
				const courses = this.courseList.find(course => course.courseID === id)
				return  courses.courseName;
			}
		}
  }
moveToAssign(){
  this.router.navigateByUrl(`/students/assign/${this.studentID}`);

}

viewpaymentBilling(payment){
  this.dialog.open(InvoiceEveryPaymentComponent, {
    data: payment,
    height: '800px',
    width: '1000px',
  });
}
	
}

import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';


//Exams
import {Exams} from '../../../../core/auth/_models/exams.model';
import {ExamStudent} from '../../../../core/auth/_models/student_exam.model';
import {examsService} from '../../../../core/auth/_services/exams.service';


//groups
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AssignExamComponent } from '../assign-student-to-exam-form/assign-exam.component';
import { ExamInvoiceComponent } from '../exam-invoice/exam-invoice.component';





@Component({
  selector: 'kt-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.scss']
})
export class StudentExamComponent implements  OnInit, OnDestroy {

  dataSource: MatTableDataSource<ExamStudent>;
  displayedColumns = ['ID', 'Exame', 'Code', 'Price','Payment','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ExamStudentList: ExamStudent[];
  selection = new SelectionModel<ExamStudent>(true, []);
  studentID
  allExams: Exams[]
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private examsService: examsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router:Router,
    private layoutUtilsService:LayoutUtilsService,
  ) { }

  ngOnInit() {
    this.getExams();
    this.loadSudent();
  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
 getExams(){
   this.examsService.getExams().subscribe(res=>{
     if(res.result==true){
       this.allExams=res.data;
       this.cdr.detectChanges()
     }
   })
 }
 
 getExamName(id){
   if(this.allExams){
     let exam =this.allExams.find(e=>e.examID===id)
     return exam.examName
   }
 }

  loadSudent() {
    this.selection.clear();
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
        this.studentID=params['id'];
      this.examsService.addStudentAssignExam(params['id']).subscribe(res => {

        if (res.result == true) {
           
             this.ExamStudentList = res.data;
             this.dataSource = new MatTableDataSource<ExamStudent>(this.ExamStudentList);
             this.dataSource.sort = this.sort;
             this.dataSource.paginator = this.paginator;
             this.cdr.detectChanges();
           
         
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


  EditAssign(student) {
  const dialogRef=  this.dialog.open(AssignExamComponent, { data: {student:student,studentID:this.studentID,exams:this.allExams }, height: '400px',
    width: '800px',});
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
				return; 
			}
			this.layoutUtilsService.showActionNotification('Student has been succefully assigned');
		   this.loadSudent()
      })
  }

  NewAssign() {
    let student = new ExamStudent();
    this.EditAssign(student)

  }
  viewStudentBilling(student) {
    console.log(student)
    this.dialog.open(ExamInvoiceComponent, {
      data: student,
      width: '800px',
    });
  }
  

}

import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort , MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { StudentService } from '../../../../core/auth/_services/students.sevice';
import {TermsConditionEditComponent} from '../terms-condition-edit/terms-condition-edit.component'

@Component({
  selector: 'kt-terms-condition-list',
  templateUrl: './terms-condition-list.component.html',
  styleUrls: ['./terms-condition-list.component.scss']
})
export class TermsConditionListComponent implements OnInit , OnDestroy {

  dataSource: MatTableDataSource<any>;
  displayedColumns = [ 'ID', 'Condition','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  terms:[];
  isAdmin: boolean;
  
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private studentService:StudentService,
    private dialog:MatDialog,
  ) { }

  ngOnInit() { 
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
		} else {
			this.isAdmin = false  
		} 
    this.loadTermsList();
    
  }  

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  

  


  loadTermsList() {
   
    const attendant = this.studentService.getTerms().subscribe(res => {
      if (res.result == true) {
        this.terms = res.data;
       
        this.dataSource = new MatTableDataSource<any>(this.terms);
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
 

  editTerms(terms){
    const dialogRef = this.dialog.open(TermsConditionEditComponent, {
			data: terms,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(' Updated Succefully');
        this.loadTermsList()

		})
  }

  addNewTerm(){
    const dialogRef = this.dialog.open(TermsConditionEditComponent, {
      data: '',
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(' Added Succefully');
        this.loadTermsList()

		})
  }


}

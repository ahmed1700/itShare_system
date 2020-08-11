import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort , MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { publicPaymentService } from '../../../../core/auth/_services/publicPayment.service';

import {CategoriesEditComponent} from '../categories-edit/categories-edit.component'

@Component({
  selector: 'kt-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit , OnDestroy {

  dataSource: MatTableDataSource<any>;
  displayedColumns = [ 'ID', 'Name','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  Categorys:[];
  isAdmin: boolean;
  
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private publicPaymentService:publicPaymentService,
    private dialog:MatDialog,
  ) { }

  ngOnInit() { 
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
		} else {
			this.isAdmin = false  
		} 
    this.loadCategorysList();
    
  }  

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  

  loadCategorysList() {
   
    const attendant = this.publicPaymentService.getAllCategory().subscribe(res => {
  
      if (res.result == true) {
        this.Categorys = res.data;
       
        this.dataSource = new MatTableDataSource<any>(this.Categorys);
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
 

  editCategorys(Categorys){
    const dialogRef = this.dialog.open(CategoriesEditComponent, {
			data: Categorys,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(' Updated Succefully');
        this.loadCategorysList()

		})
  }

  addNewCategory(){
    const dialogRef = this.dialog.open(CategoriesEditComponent, {
      data: '',
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(' Added Succefully');
        this.loadCategorysList()

		})
  }


}

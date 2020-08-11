
// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource ,MatSort} from '@angular/material';
// RXJS

import { Subscription } from 'rxjs';

// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
// Models
import { SubheaderService } from '../../../../core/_base/layout';
 
import {VacationsService} from '../../../../core/auth/_services/vacations.service';
import {vacation} from   '../../../../core/auth/_models/vacations.model';

@Component({
  selector: 'kt-vacations-list',
  templateUrl: './vacations-list.component.html'
})
export class VacationsListComponent implements OnInit,OnDestroy{
// Table fields
dataSource: MatTableDataSource<any>;
displayedColumns = ['select', 'vacationID','title','date','actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
// Selection
selection = new SelectionModel<vacation>(true, []);
vacationsResult: vacation[]=[] ;
isAdmin: boolean;
// Subscriptions
private subscriptions: Subscription[] = [];
  constructor(
    private vacationsService:VacationsService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
		} else {
			this.isAdmin = false 
		}
    this.loadVacationList();
    this.subheaderService.setTitle('Vacation');
  }
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

 
  loadVacationList() {
    this.selection.clear();
    const addSubscription =this.vacationsService.getVacations().subscribe((res)=>{
        if(res.result==true){
          this.vacationsResult=res.data;
          this.dataSource=new MatTableDataSource<vacation>(this.vacationsResult);
          this.dataSource.sort=this.sort;
          this.dataSource.paginator=this.paginator;
          this.cdr.detectChanges();
        }
     }) 
    this.selection.clear();
    this.subscriptions.push(addSubscription);
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  fetchVacations() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `Vacation Date:${elem.date}`,
        id: elem.vacationID.toString(),
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.vacationsResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.vacationsResult.length) {
      this.selection.clear();
    } else {
      this.vacationsResult.forEach(row => this.selection.select(row));
    }
  }

  /* UI */
  /**
   * Returns Student roles string
   *
   
   *
   * @param id
   */
  editVacation(id) {
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }



}

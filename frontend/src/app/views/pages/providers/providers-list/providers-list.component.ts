
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
 // student
import {ProvidersService} from '../../../../core/auth/_services/providers.service';
import {provider} from   '../../../../core/auth/_models/providers.models';

@Component({
  selector: 'kt-providers-list',
  templateUrl: './providers-list.component.html'
})
export class ProvidersListComponent implements OnInit,OnDestroy{
// Table fields
dataSource: MatTableDataSource<provider>;
displayedColumns = ['select', 'providerID','providerName', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
// Selection
selection = new SelectionModel<provider>(true, []);
providersResult: provider[]=[] ;
// Subscriptions
private subscriptions: Subscription[] = [];
  constructor(
    private providersService:ProvidersService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
		this.loadProvidersList();
    this.subheaderService.setTitle('Providers');
  }
  ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadProvidersList() {
		this.selection.clear();
    const addSubscription =this.providersService.getProviders().subscribe((res)=>{
        if(res.result==true){
					this.providersResult=res.data;
					this.dataSource=new MatTableDataSource<provider>(this.providersResult);
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
	fetchProviders() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `providerDesc:${elem.providerDesc},employeeID:${elem.employeeID}`,
				id: elem.providerID.toString(),
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.providersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.providersResult.length) {
			this.selection.clear();
		} else {
			this.providersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns Student roles string
	 *
	 
	 *
	 * @param id
	 */
	editProvider(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}



}

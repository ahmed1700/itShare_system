
// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// RXJS

import { Subscription } from 'rxjs';

// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
// Models
import { SubheaderService } from '../../../../core/_base/layout';
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';


@Component({
	selector: 'kt-branches-list',
	templateUrl: './branches-list.component.html',
})
export class BranchesListComponent implements OnInit, OnDestroy {

	dataSource: MatTableDataSource<any>;
	displayedColumns = ['select', 'branchID', 'name', 'homeTel1', 'mobile1', 'email', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Branch>(true, []);
	branchesResult: Branch[] = [];
	// Subscriptions 
	private subscriptions: Subscription[] = [];
	isAdmin: boolean;

	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private branchesService: branchesService,
		private cdr: ChangeDetectorRef
	) { } 
 
	ngOnInit() {
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
		} else {
			this.isAdmin = false  
		} 
		this.loadBrachesList();
		this.subheaderService.setTitle('Branches');
	}
	loadBrachesList() {
		this.selection.clear();
		const addSubscription = this.branchesService.getBranches().subscribe((res) => {
			if (res.result == true) {
				this.branchesResult = res.data;
				this.dataSource = new MatTableDataSource<Branch>(this.branchesResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			}
		})
		this.selection.clear();
		this.subscriptions.push(addSubscription);
	}

	public doFilter = (value: string) => {
		this.dataSource.filter = value.trim().toLocaleLowerCase();
	}
	fetchBranch() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `details:${elem.details},address: ${elem.address},Telephone2: ${elem.homeTel2},Mobile2: ${elem.mobile2}`,
				id: elem.branchID.toString(),
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.branchesResult.length;
		return numSelected === numRows;
	}

	/**
 * Toggle selection
 */
	masterToggle() {
		if (this.selection.selected.length === this.branchesResult.length) {
			this.selection.clear();
		} else {
			this.branchesResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns Student roles string
	 *
	 
	 *
	 * @param id
	 */
	editBranch(id) {
		this.router.navigate(['./edit', id], { relativeTo: this.activatedRoute });
	}


}

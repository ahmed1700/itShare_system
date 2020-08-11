
// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
// RXJS

import { Subscription } from 'rxjs';
 
// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
// Models
import { SubheaderService } from '../../../../core/_base/layout';
// student
import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';

import { ChangePassComponent } from '../change-pass/change-pass.component'


@Component({
	selector: 'kt-trainers-list',
	templateUrl: './trainers-list.component.html'
})
export class TrainersListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['select', 'trainerID', 'fullNameArabic', 'email', 'mobile1', 'contractType', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	isAdmin: boolean; 
	// Selection
	selection = new SelectionModel<Trainer>(true, []);
	TrainersResult: Trainer[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	constructor(private trainerService: TrainersService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog, ) { }

	ngOnInit() {
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
		} else {
			this.isAdmin = false
		}
		this.loadTrainersList();
		this.subheaderService.setTitle('Trainers');
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadTrainersList() {
		this.selection.clear();
		const addSubscription = this.trainerService.getTrainers().subscribe((res) => {
			if (res.result == true) {
				this.TrainersResult = res.data;
				this.dataSource = new MatTableDataSource<Trainer>(this.TrainersResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			} else {
				console.log(res.message)
			}
		})
		this.selection.clear();
		this.subscriptions.push(addSubscription);
	}
	public doFilter = (value: string) => {
		this.dataSource.filter = value.trim().toLocaleLowerCase();
	}
	fetchTrainers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `mobile2:${elem.mobile2},gender: ${elem.gender},city:${elem.city},nationalID:${elem.nationalID},address:${elem.address},employee:${elem.employeeID}`,
				id: elem.trainerID.toString(),
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.TrainersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.TrainersResult.length) {
			this.selection.clear();
		} else {
			this.TrainersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns Student roles string
	 *
	 
	 *
	 * @param id
	 */
	editTrainer(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	changePassword(trainerID) {
		const dialogRef = this.dialog.open(ChangePassComponent, {
			data: trainerID,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification('Password Changed Succefully');

		})
	}
}

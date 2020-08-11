
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
// Course
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';
//Provider
import { ProvidersService } from '../../../../core/auth/_services/providers.service';
import { provider } from '../../../../core/auth/_models/providers.models';

import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';



@Component({
	selector: 'kt-courses-list',
	templateUrl: './courses-list.component.html'
})
export class CoursesListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['select', 'courseID', 'courseName', 'provider', 'courseHours', 'coursePrice', 'discount', 'priceAfterDiscount', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Course>(true, []);
	coursesResult: Course[] = [];
	allProvider: provider[];
	selectedProvider;
	provider: string;
	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private coursesService: CoursesService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private providersService: ProvidersService,
		private cdr: ChangeDetectorRef,
		private TracksService: TracksService
	) { }
	ngOnInit() {
		this.getAllProviders();
		this.loadCourseList();

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Courses');
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	loadCourseList() {
		this.selection.clear();
		const addSubscription = this.coursesService.getCourses().subscribe((res) => {
			if (res.result == true) {
				this.coursesResult = res.data;
				this.dataSource = new MatTableDataSource<Course>(this.coursesResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;

				this.cdr.detectChanges();
			}
		})
		this.selection.clear();
		this.subscriptions.push(addSubscription);

	}

	getAllProviders() {
		const addSubscription = this.providersService.getProviders().subscribe(res => {
			if (res.result == true) {
				this.allProvider = res.data;
				this.cdr.detectChanges();
			}

		})
		this.subscriptions.push(addSubscription);
	}

	getProviderName(id) {
		if (this.allProvider) {
			if (this.allProvider.length > 0) {
				const providers = this.allProvider.find(provider => provider.providerID === id)
				return providers.providerName
			}
		}
	}


	public doFilter = (value: string) => {
		this.dataSource.filter = value.trim().toLocaleLowerCase();
	}
	

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.coursesResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.coursesResult.length) {
			this.selection.clear();
		} else {
			this.coursesResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns Student roles string
	 *
	 
	 *
	 * @param id
	 */
	editCourse(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}


	filterByProvider() {
		if (this.selectedProvider == '') {
			this.dataSource = new MatTableDataSource<Course>(this.coursesResult)
		} else {
			this.dataSource = new MatTableDataSource<Course>(this.coursesResult.filter(p => p.providerID == this.selectedProvider));
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}

	}




}

// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { GroupDetailsComponent } from '../group-details/group-details.component'
// RXJS

import { Subscription } from 'rxjs';

// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
// Models
import { SubheaderService } from '../../../../core/_base/layout';

//courses
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';

//groups

import { GroupsService } from '../../../../core/auth/_services/group.service';
import { Group } from '../../../../core/auth/_models/group.model';

//Branch
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';



@Component({
	selector: 'kt-group-list',
	templateUrl: './group-list.component.html'
})
export class GroupListComponent implements OnInit, OnDestroy {

	// Subscriptions
	private subscriptions: Subscription[] = [];
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['select', 'groupID', 'groupName', 'branch', 'course', 'groupType', 'groupStatus', 'class', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Group>(true, []);
	GroupsResult: Group[] = [];
	filterGroupResult : Group[] = [];
	allCourses: Course[];
	selectedCourse = 0;
	allBranches: Branch[];
	selectedBranch = 0;
	selectedStatus = '0'
	groupStatus = ['pending', 'working', 'completed','waiting']

	constructor(
		private coursesService: CoursesService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private groupsService: GroupsService,
		private branchesService: branchesService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,

	) { }
	ngOnInit() {
		this.getAllCourses();
		this.getAllBranches();
		this.loadGroupsList();

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Groups');
		
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadGroupsList() {
		this.selection.clear();
		const Group = this.groupsService.getGroups().subscribe((res) => {
			if (res.result == true) {
				this.GroupsResult = res.data;
				this.dataSource = new MatTableDataSource<Group>(this.GroupsResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;

				this.cdr.detectChanges();
			} else {
				console.log(res.message)
			}
		})
		this.subscriptions.push(Group)
		this.selection.clear();
	}

	getAllCourses() {
		const addSubscription = this.coursesService.getCourses().subscribe(res => {
			if (res.result == true) {
				this.allCourses = res.data;
			}

		})
		this.subscriptions.push(addSubscription);
	}

	getAllBranches() {
		let branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
			}
		})
		this.subscriptions.push(branches)
	}

	public doFilter = (value: string) => {
		this.dataSource.filter = value.trim().toLocaleLowerCase();
	}
	fetchGroups() {
		const messages = [];

		this.layoutUtilsService.fetchElements(messages);
	}


	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.GroupsResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.GroupsResult.length) {
			this.selection.clear();
		} else {
			this.GroupsResult.forEach(row => this.selection.select(row));
		}
	}


	editGroup(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}


	filterByCourse() {

		if (this.selectedCourse != 0 && this.selectedBranch != 0) {
			this.dataSource = new MatTableDataSource<Group>(this.GroupsResult.filter(p => p.courseID == this.selectedCourse && p.branchID == this.selectedBranch));
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();

		}
		else if (this.selectedCourse != 0) {
			this.dataSource = new MatTableDataSource<Group>(this.GroupsResult.filter(p => p.courseID == this.selectedCourse));
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}
		else {
			this.dataSource = new MatTableDataSource<Group>(this.GroupsResult);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}

	}
	filterByBranch() {
		if (this.selectedCourse != 0 && this.selectedBranch != 0) {
			this.dataSource = new MatTableDataSource<Group>(this.GroupsResult.filter(p => p.courseID == this.selectedCourse && p.branchID == this.selectedBranch));
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();

		}
		else if (this.selectedBranch != 0) {
			this.dataSource = new MatTableDataSource<Group>(this.GroupsResult.filter(p => p.branchID == this.selectedBranch));
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}
		else {
			this.dataSource = new MatTableDataSource<Group>(this.GroupsResult);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}
	}

	getBranchName(id) {
		if (this.allBranches) {
			if (this.allBranches.length > 0) {
				const branches = this.allBranches.find(branch => branch.branchID === id)
				return branches.name
			}
		}
	}



	getCourseName(id) {
		if (this.allCourses) {
			if (this.allCourses.length > 0) {
				const courses = this.allCourses.find(course => course.courseID === id)
				return courses.courseName
			}
		}
	}
	viewGroupDetails(id) {
		// this.dialog.open(GroupDetailsComponent, {
		// 	data: id, height: '620px', width: '1200px'
		// });
		this.router.navigate([`/groups/view/${id}`]);

	}
	filterByParams() {
		this.filterGroupResult = this.GroupsResult
		if (this.selectedBranch == 0 && this.selectedCourse == 0 && this.selectedStatus == '0' ) {
		  this.dataSource = new MatTableDataSource<Group>(this.filterGroupResult);
		  this.dataSource.sort = this.sort;
		  this.dataSource.paginator = this.paginator;
		  this.cdr.detectChanges();
		}
		else if (this.selectedBranch != 0 && this.selectedCourse != 0 && this.selectedStatus != '0' ) {
		  console.log('6')
		  this.dataSource = new MatTableDataSource<Group>(this.filterGroupResult.filter(p =>
			p.branchID == this.selectedBranch && p.groupStatus == this.selectedStatus && p.courseID == this.selectedCourse));
		 
		}
		else if (this.selectedBranch != 0 || this.selectedCourse !== 0 || this.selectedStatus != '0' ) {
	
		  if (this.selectedBranch != 0) {
			this.filterGroupResult = this.filterGroupResult.filter(p => p.branchID == this.selectedBranch);
			
		  }
		  if (this.selectedCourse != 0) {
			this.filterGroupResult = this.filterGroupResult.filter(p => p.courseID == this.selectedCourse);
		  }
		  if (this.selectedStatus != '0') {
			this.filterGroupResult = this.filterGroupResult.filter(p => p.groupStatus == this.selectedStatus);
			this.dataSource = new MatTableDataSource<Group>(this.filterGroupResult)
		  } 
		  this.dataSource = new MatTableDataSource<Group>(this.filterGroupResult);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
	
		}
	
	}

}

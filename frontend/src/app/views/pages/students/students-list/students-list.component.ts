
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
// student
import { StudentService } from '../../../../core/auth/_services/students.sevice';
import { Student } from '../../../../core/auth/_models/students.model';
//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';


// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4

@Component({
	selector: 'kt-students-list',
	templateUrl: './students-list.component.html',
})
export class StudentsListComponent implements OnInit, OnDestroy {

	// Table fields
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['select', 'studentID', 'fullNameArabic', 'email', 'branch', 'mobile1', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;


	// Selection
	selection = new SelectionModel<Student>(true, []);
	StudentsResult: Student[] = [];
	allBranches: Branch[]; // بجيب كل البرانشات علشان اعمل فيلتر بيهم
	selectedBranch;   //بفلتر بالفرع 
	
	// Subscriptions
	private subscriptions: Subscription[] = [];


	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private studentService: StudentService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private branchesService: branchesService,
		private cdr: ChangeDetectorRef) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// load students list
	//	this.getAllBranches();
		this.loadStudentsList();
		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Students');
	}


	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}


	
	/**
	 * Load Students list
	 */
	loadStudentsList() {
		this.selection.clear();
		const student = this.studentService.getStudents().subscribe((res) => {
			if (res.result == true) {
				this.StudentsResult = res.data;
				this.allBranches=res.branches
				this.dataSource = new MatTableDataSource<Student>(this.StudentsResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();// دي هنا بقوله لاحظ التغير اللي حصل علشان ميتاخرش علي ما الداتا تظهر جوه الجدول
			}
		})
		this.subscriptions.push(student)
		this.selection.clear();
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

	


	/** ACTIONS */
	/**
	 * Delete Student
	 *
	 * @param _item: Student
	 */


	/**
	 * Fetch selected rows
	 */
	fetchStudents() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `mobile2:${elem.mobile2},gender: ${elem.gender},studentsType: ${elem.studentsType},city:${elem.city},nationalID:${elem.nationalID},address:${elem.address}`,
				id: elem.studentID.toString(),
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.StudentsResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.StudentsResult.length) {
			this.selection.clear();
		} else {
			this.StudentsResult.forEach(row => this.selection.select(row));
		}
	}


	/* UI */
	/**
	 * Returns Student roles string
	 *
	 
	 *
	 * @param id
	 */
	editStudent(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	viewStudentBilling(id) {
		this.router.navigate(['assign', id], { relativeTo: this.activatedRoute });
	}

	viewStudentPayment(id) {
		this.router.navigate(['payments', id], { relativeTo: this.activatedRoute });
	}
	AssignToExam(id){
		this.router.navigate(['exam', id], { relativeTo: this.activatedRoute });
	}


	//filter by branch

	filterByBranch() {
		if (this.selectedBranch == '') {
			this.dataSource = new MatTableDataSource<Student>(this.StudentsResult);
		} else {
			this.dataSource = new MatTableDataSource<Student>(this.StudentsResult.filter(p =>
				p.branchID == this.selectedBranch))
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





}

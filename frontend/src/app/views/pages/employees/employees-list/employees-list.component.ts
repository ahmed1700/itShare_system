
// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ChangePassComponent } from '../change-pass/change-pass.component'
// RXJS

import { Subscription } from 'rxjs';

// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
// Models
import { SubheaderService } from '../../../../core/_base/layout';
// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';
import { Employee } from '../../../../core/auth/_models/employees.model';
//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';
import { EmployeeNameComponent } from '../employee-loan/employee-name.component';

@Component({
	selector: 'kt-employees-list',
	templateUrl: './employees-list.component.html',
})
export class EmployeesListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: MatTableDataSource<Employee>;
	displayedColumns = ['select', 'employeeID', 'fullNameArabic', 'salary', 'loan', 'branch', 'mobile1', 'status', 'role', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	isAdmin: boolean;
	loans
	// Selection
	selection = new SelectionModel<Employee>(true, []);
	EmployeesResult: Employee[] = [];
	allBranches: Branch[]; // بجيب كل البرانشات علشان اعمل فيلتر بيهم
	selectedStatus;   // بقلتر بحالة الموظف 
	selectedBranch;   //بفلتر بالفرع 
	selectedRole;
	status = ['active', 'deactive'];
	roles = ['Admin', 'Manager'];
	branchName: string;
	selectedMonth
	filterLoans
	// Subscriptions
	private subscriptions: Subscription[] = [];

	constructor(private employeesService: EmployeesService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private branchesService: branchesService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.selectedMonth = (new Date().getMonth() + 1).toString()
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
			this.isAdmin = true
			this.loadEmployeesList();
			this.getAllBranches();
		} else {

			this.isAdmin = false
			let employees = this.employeesService.getemployeeByID(JSON.parse(localStorage.getItem('currentUser')).employeeID).subscribe(res => {
				if (res.result == true) {
					this.EmployeesResult.push(res.data)
					this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult);
					this.dataSource.sort = this.sort;
					this.dataSource.paginator = this.paginator;
					this.loans = res.loan
					this.filterByMonth()
				}
				this.subscriptions.push(employees)
			})
		}
		// load students list



		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Employees');
	}
	/**
 * On Destroy
 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	loadEmployeesList() {
		this.selection.clear();
		const employes = this.employeesService.getemployees().subscribe((res) => {
			if (res.result == true) {
				this.EmployeesResult = res.data;
				this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.loans = res.loan
				this.cdr.detectChanges();
				// دي هنا بقوله لاحظ التغير اللي حصل علشان ميتاخرش علي ما الداتا تظهر جوه الجدول
			}
		})
		this.selection.clear();
		this.subscriptions.push()
		this.subscriptions.push(employes);

	}
	getAllBranches() {
		const branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
			}

		})
		this.subscriptions.push(branches)
	}

	public doFilter = (value: string) => {
		this.dataSource.filter = value.trim().toLocaleLowerCase();
	}

	getBranchName(id) {
		if (this.allBranches) {
			if (this.allBranches.length > 0) {
				const branches = this.allBranches.find(branch => branch.branchID === id)
				return branches.name
			}
		}

	}	/**
 * Fetch selected rows
 */
	fetchEmployees() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `mobile2:${elem.mobile2},gender: ${elem.gender},
        fullNameEnglish: ${elem.fullNameEnglish},city:${elem.city},
        nationalID: ${elem.nationalID},address:${elem.address},
        mobile2:${elem.mobile2},gender:${elem.gender},city:${elem.city}`,
				id: elem.employeeID.toString(),
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}
	/**
		* Check all rows are selected
		*/
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.EmployeesResult.length;
		return numSelected === numRows;
	}
	/**
	   * Toggle selection
	   */
	masterToggle() {
		if (this.selection.selected.length === this.EmployeesResult.length) {
			this.selection.clear();
		} else {
			this.EmployeesResult.forEach(row => this.selection.select(row));
		}
	}
	editEmployee(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}
	filterByBranch() {
		if (this.selectedBranch == '') {
			this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult)
		} else {
			this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult.filter(p =>
				p.branchID == this.selectedBranch))
		}
	}
	filterByStatus() {
		if (this.selectedStatus == '') {
			this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult)
		}
		else {
			this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult.filter(p =>
				p.status == this.selectedStatus))
		}
	}
	filterByRole() {
		if (this.selectedRole == '') {
			this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult)
		}
		else {
			this.dataSource = new MatTableDataSource<Employee>(this.EmployeesResult.filter(p =>
				p.role == this.selectedRole))
		}
	}
	changePassword(employeeID) {
		const dialogRef = this.dialog.open(ChangePassComponent, {
			data: employeeID,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification('Password Changed Succefully');

		})
	}

	changMyPass(id) {
		if (JSON.parse(localStorage.getItem('currentUser')).employeeID == id) {
			return true
		} else {
			return false
		}

	}
	employeeLoan(id) {
		const dialogRef = this.dialog.open(EmployeeNameComponent, {
			data: id,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.loadEmployeesList()
			this.layoutUtilsService.showActionNotification('Loan Succefully');
		})
	}

	getLoanByEmoployeeID(id) {
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
		let employeeLoans = this.loans.filter(p => p.employeeID === id)
		let loanValue = employeeLoans.reduce((a, b) => a + +(b['loanValue'] || 0), 0)
		return loanValue
		}else{
		let employeeLoans = this.filterLoans.filter(p => p.employeeID === id)
		let loanValue = employeeLoans.reduce((a, b) => a + +(b['loanValue'] || 0), 0)
		return loanValue
		}
	}

	filterByMonth() {
		if (JSON.parse(localStorage.getItem('currentUser')).role == 'Admin') {
		let loans = this.employeesService.filterLoanByMonth(+this.selectedMonth).subscribe(res => {
			this.loans = res.data
		})
		this.subscriptions.push(loans)
	} else{

		this.filterLoans=this.loans.filter(p=>(new Date(p.creationDate).getMonth()+1).toString()===this.selectedMonth)
		
	}
	}

}

import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { LayoutUtilsService } from '../../../../core/_base/crud';

import { MatDialog } from '@angular/material';


import { ActivatedRoute, Router } from '@angular/router';


// Employees
import { EmployeesService } from '../../../../core/auth/_services/employees.service';
import { Employee } from '../../../../core/auth/_models/employees.model';

//Exams

import {Exams} from '../../../../core/auth/_models/exams.model';
import {examsService} from '../../../../core/auth/_services/exams.service';

//Provider
import { ProvidersService } from '../../../../core/auth/_services/providers.service';
import { provider } from '../../../../core/auth/_models/providers.models';



//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';

@Component({
  selector: 'kt-exams-list',
  templateUrl: './exams-list.component.html',
  styleUrls: ['./exams-list.component.scss']
})
export class ExamsListComponent implements OnInit , OnDestroy {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['ID', 'Provider','Name','code', 'employee','totalPrice','currentPrice','creationDate','actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ExamsList: Exams[];
  allEmployees: Employee[];
 
  allProvider: provider[];
  selectedProvider
  Exams = []
  isAdmin: boolean;
  filterExams;
  selectedBranch=0
  end_date;
  start_date;
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private ExamssService: examsService,
    private layoutUtilsService: LayoutUtilsService,
    private activatedRoute: ActivatedRoute,
		private router: Router,
    private cdr: ChangeDetectorRef,
    private EmployeesService: EmployeesService,
    private branchesService: branchesService,
    public dialog: MatDialog,
    private providersService: ProvidersService,
  ) { }

  ngOnInit() {
    this.getAllProviders();  
    this.getAllEmployees();
    this.loadExams();
    
    
  }

  /**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  getAllEmployees() {
    let employees = this.EmployeesService.getemployees().subscribe(res => {
      if (res.result == true) {
        this.allEmployees = res.data;
      }
    })
    this.subscriptions.push(employees)
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
  
  filterByProvider() {
		if (this.selectedProvider == '') {
			this.dataSource = new MatTableDataSource<Exams>(this.ExamsList)
		} else {
			this.dataSource = new MatTableDataSource<Exams>(this.ExamsList.filter(p => p.providerID == this.selectedProvider));
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}

	}

  
  loadExams() {
    const Examss = this.ExamssService.getExams().subscribe(res => {
      if (res.result) {
        this.ExamsList = res.data;
       
          this.dataSource = new MatTableDataSource<Exams>(this.ExamsList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        
       
      }

    }, error => {

    }
    )
    this.subscriptions.push(Examss)
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  

  getEmployeeName(id) {
    if (this.allEmployees) {
      if (this.allEmployees.length > 0) {
        const employees = this.allEmployees.find(employee => employee.employeeID === id)
        return employees.fullNameEnglish
      }
    }
  }

 
  
  editExam(id){
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }


}

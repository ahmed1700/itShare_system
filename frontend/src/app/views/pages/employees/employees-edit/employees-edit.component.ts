import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
// RxJS
import { Observable, Subscription } from 'rxjs';

//validation
import { CustomValidators } from 'ng2-validation';
// Layout
import { SubheaderService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';
//employee
import { EmployeesService } from '../../../../core/auth/_services/employees.service';
import { Employee } from '../../../../core/auth/_models/employees.model';
//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';

//angular material
import { MatDialog } from '@angular/material';
// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'

@Component({
	selector: 'kt-employees-edit',
	templateUrl: './employees-edit.component.html',
})
export class EmployeesEditComponent implements OnInit {
	// Public properties
	Employee: Employee;
	EmployeeId$: Observable<number>;
	oldEmployee: Employee;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	Cities = ['Cairo', 'Alexandria', 'al-Jizah', 'Abnub', 'Tanta', 'al-Mansurah', 'Sharm-ash-Shaykh',
		'al-Fayyum', '´Izbat-al-Burj', 'al-Ibrahimiyah', 'Asyut', 'al-Ismailiyah',
		'Nasr', 'al-Qanatir-al-Khayriyah', 'Aswan', 'Damanhur', 'al-Ghardaqah',
		'Shubra al-Khaymah', 'al-Ashir mir-Ramadan', 'Aja', 'Bur Sa´id', 'Mit Gamr',
		'Banha', 'Abu Kabir', 'az-Zaqaziq', 'Sawhaj', 'Awsim', 'Shibin-al-Kawm', 'Talkha',
		'Zifta', 'Kafr-az-Zayyat', ' al-Karnak', 'an-Nasir', 'Ras Gharib', 'al-Mahallah al-Kubra',
		'Kafr-ash-Shaykh', 'al-Matariyah', 'Dumyat', 'al-Kharijah', 'Lalamusa', 'Abyar', 'as-Suways',
		'Kafr-ad-Dawwar', 'Bani Suwayf', ' al-´Abbasiyah', 'Bilqas', 'Sibin-al-Qanatir', 'Shirbin',
		'Matay', 'Kafr Saqr', 'Abu Hummus', 'Dandarah', 'al-Qusayr', 'al-Burj', 'al-Uqsur', 'Qina',
		'Mallawi', 'Minuf', 'Faqus', 'Dishna', 'Tala', 'Kawm Hamada', 'Abu Hammad', 'Rafah', 'al-Husayniyah', 'Dar-as-Salam', 'al-Mahmudiyah', 'al-Fant', ' al-Maks', 'al-Hawamidiyah', 'Akhmim',
		'Samalut', 'Nasir', 'Ashmun', 'al-Manzilah', 'Magagah', 'Rashid', 'Isna', 'al-Khankah', 'Marsa Matruh', 'al-Badrashayn', 'Qus', 'Sidi Salim', 'Quwaysina', 'Abu al-Matamir', 'Naj´ Hammadi', 'as-Saff',
		'al-Maragah', 'Ihnasiyah', 'Mutubis', 'an-Nukhaylah', 'Qift', 'Naqadah', 'Shubra Khit', 'Mahallat Marhum', 'Sahil Salim', 'ad-Dayr', 'Kafr Salim', 'Zawiyat Sidi Gazi', 'Sawl', 'Sanhur', 'al-Mansuriyah', 'Bahut', 'Tandah', 'al-Masarah',
		'al-Batanun', 'Hijazah', 'Daraw', 'ad-Dabbiyah', 'al-Ghuli´ah', 'Bilbays', 'Qalyub', 'Disuq', 'Armant', 'Abu Tij', 'Tukh', 'Biyala', 'Minyat-al-Qamh', 'Bani Mazar', 'al-Fashn', 'Abu Qurqas', 'Minyat-an-Nasr', 'Samannud', 'Itsa', 'az-Zarqa', 'Dayr Mawas', 'al-Bajur', 'al-Wasitah',
		'Sumusta', 'ar-Rawdah', 'Birkat-as-Sab´', 'Safaja', 'ar-Rahmaniyah', 'al-Wahat-al-Bahriyah', 'Qallin', 'Hiw,', 'ar-Radisiyat-al-Bahriyah', 'al-Ballas', 'Saqqarah',
		'ad-Daba', 'Sanabu', 'Qutur', 'Umm-al-Qusur', 'al-Qassasin', 'Qiman al-´Arus', 'al-Fikriyah', 'Tallah', 'al-Qantarah', 'as-Santah', 'Bani Muhammadiyat', 'Buturis', 'Kafr-al-Battikh', 'Kafr-al-Jara´idah', 'Abu Za´bal', 'Kiman-al-Mata´inah', 'Qasr Qarun', 'Fidimin', 'Nahya', 'al-Haddadi', 'al-Kawm-al-Akhdar', 'ad-Daljamun', 'Milij',
		'Dayrut-ash-Sharif', 'Nisf Thani Bashbish', 'Fa´id', 'Awlad Tawq Sharq', 'Abu Rudays', 'al-Waqf', 'Qasr-al-Farafirah', 'Sidi Barrani', 'at-Tur', 'Atfih', 'Asfun-al-Mata´inah', 'Sarabiyum', 'Zawiyat Shammas', 'as-Salihiyah', 'Jirja', 'Idfu', 'Idku', 'Dikirnis', 'Tagta', 'as-Sinbillawayn', 'Hawsh ´Îsa', 'Sinnuris', 'Manfalut', 'al-Jamaliyah', 'Tima', 'al-Qusiyah', 'Dayrut', 'Fuwah', 'Kawm Umbu', 'al-Qurayn', 'al-Manshah', 'Faraskur',
		'Beba Veche', 'Basyun', 'Farshut', 'Sirs-al-Layyanah', 'Diyarb Najm', 'at-Tall-al-Kabir']
	employeeStatus = ['active', 'deactive'];
	employeeRoles=['Admin','Manager'];
	branchName: string;
	allBranches: Branch[]; 
	EmployeesForm: FormGroup;
	hasFormErrors: boolean = false;
	errorMessage: string = '';
	editPassword: boolean = false;

	// Private properties
	private subscriptions: Subscription[] = [];

	// validation properties
	numberNotAllowedRegx = /^([^0-9]*)$/;
	specialCharsNotAllowed = /^[^+!@#$_%,.`-]*$/;
	numbersOnly = "^[0-9]*$";

	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private EmployeesService: EmployeesService,
		private branchesService: branchesService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
	) { }

	ngOnInit() {
		this.getAllBranches();
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				this.EmployeesService.getemployeeByID(id).subscribe(res => {

					if (res.result == true) {
						this.Employee = res.data;
						this.editPassword = false;
						this.oldEmployee = Object.assign({}, this.Employee);
						this.initEmployee()

					}
				});
			} else {
				this.Employee = new Employee();
				this.Employee.clear();
				this.editPassword = true;
				this.oldEmployee = Object.assign({}, this.Employee);
				this.initEmployee();
			}
		});
		this.subscriptions.push(routeSubscription)
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	// get branches
	getAllBranches() {
		const branches = this.branchesService.getBranches().subscribe(res => {
			if (res.result == true) {
				this.allBranches = res.data;
			}

		})
		this.subscriptions.push(branches)
	}
	//this.EmployeeFB.group
	createForm() {
		this.EmployeesForm = new FormGroup({
			fullNameArabic: new FormControl(this.Employee.fullNameArabic,
				[Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed), Validators.minLength(3)]),
			fullNameEnglish: new FormControl(this.Employee.fullNameEnglish,
				[Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed), Validators.minLength(3)]),
			nationalID: new FormControl(this.Employee.nationalID,
				[Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([14, 14])]),
			mobile1: new FormControl(this.Employee.mobile1,
				[Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]),
			mobile2: new FormControl(this.Employee.mobile2,
				[Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]),
			email: new FormControl(this.Employee.email, [Validators.required, CustomValidators.email]),
			gender: new FormControl(this.Employee.gender, Validators.required),
			homeTel: new FormControl(this.Employee.homeTel, [Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([7, 12])]),
			city: new FormControl(this.Employee.city, Validators.required),
			address: new FormControl(this.Employee.address, [Validators.required, Validators.minLength(5)]),
			status: new FormControl(this.Employee.status, Validators.required),
			branchID: new FormControl(this.Employee.branchID, Validators.required),
			password: new FormControl('', [Validators.pattern('^([a-z0-9A-Z]*)$')]),
			roles: new FormControl(this.Employee.role, Validators.required),
			salary: new FormControl(this.Employee.salary, [Validators.pattern(this.numbersOnly),Validators.required]),
		});
	}
	/**
 * Init Emplyee
 */
	initEmployee() {
		this.createForm();
		if (!this.Employee.employeeID) {
			this.subheaderService.setTitle('Create Employee');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Employee', page: `Employees` },
				{ title: 'Employees', page: `Employees` },
				{ title: 'Create Employee', page: `employees/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Employee');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Employee ', page: `Employees` },
			{ title: 'Employees', page: `Employees` },
			{ title: 'Edit Employee', page: `employees/edit`, queryParams: { id: this.Employee.employeeID } }
		]);
	}



	/**
 * Redirect to list
 *
 */
	goBackWithId() {
		const url = `/employees`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	/**
 * Refresh Employee
 *
 * @param isNew: boolean
 * @param id: number
 */
	refreshEmployee(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/employees/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	/**
	   * Reset
	   */
	reset() {
		this.Employee = Object.assign({}, this.oldEmployee);
		this.createForm();
		this.hasFormErrors = false;
		this.EmployeesForm.markAsPristine();
		this.EmployeesForm.markAsUntouched();
		this.EmployeesForm.updateValueAndValidity();
	}
	/**
 * Save data
 *
 * @param withBack: boolean
 */
	onSumbit(withBack: boolean = false) {
		if (this.selectedTab == 0) {
			this.hasFormErrors = false;
			const controls = this.EmployeesForm.controls;
			/** check form */
			if (this.EmployeesForm.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);

				this.hasFormErrors = true;
				this.errorMessage = 'Please check invalid fields'
				this.selectedTab = 0;
				return;
			}

			const editedEmployee = this.prepareEmployee();
			delete editedEmployee.employeeID;
			if (this.oldEmployee.employeeID > 0) {
				this.updateEmployee(editedEmployee, withBack);
				return;
			}

			this.addEmployee(editedEmployee, withBack);
		}

	}
	/**
 * Returns prepared data for save
 */
	prepareEmployee(): Employee {
		const controls = this.EmployeesForm.controls;
		const _Employee = new Employee();
		_Employee.clear();
		_Employee.fullNameArabic = controls['fullNameArabic'].value;
		_Employee.fullNameEnglish = controls['fullNameEnglish'].value;
		_Employee.email = controls['email'].value;
		_Employee.nationalID = controls['nationalID'].value;
		_Employee.mobile1 = controls['mobile1'].value;
		_Employee.mobile2 = controls['mobile2'].value;
		_Employee.homeTel = controls['homeTel'].value;
		_Employee.address = controls['address'].value;
		_Employee.branchID = controls['branchID'].value;
		_Employee.gender = controls['gender'].value;
		_Employee.city = controls['city'].value;
		_Employee.status = controls['status'].value;
		_Employee.password = controls['password'].value;
		_Employee.role=controls['roles'].value;
		_Employee.salary=controls['salary'].value;
		if (this.editPassword == false&&(controls['password'].value==null||controls['password'].value=='')) {
			delete _Employee.password
		}
		return _Employee;
	}
	/**
	 * Update Employee
	 * @param _Employee 
	 * @param withBack 
	 */
	updateEmployee(_Employee: Employee, withBack: boolean = false) {
		

		if (_Employee.branchID == this.oldEmployee.branchID && _Employee.fullNameArabic == this.oldEmployee.fullNameArabic &&
			_Employee.fullNameEnglish == this.oldEmployee.fullNameEnglish && _Employee.gender == this.oldEmployee.gender &&
			_Employee.mobile1 == this.oldEmployee.mobile1 && _Employee.mobile2 == this.oldEmployee.mobile2 &&
			_Employee.nationalID == this.oldEmployee.nationalID && _Employee.status == this.oldEmployee.status &&
			_Employee.homeTel == this.oldEmployee.homeTel && _Employee.address == this.oldEmployee.address &&
			_Employee.email == this.oldEmployee.email && 
			_Employee.city == this.oldEmployee.city&& _Employee.password==null
		) {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update Employee', 'message': 'There are no changes, Are you sure you want to exit?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.layoutUtilsService.showActionNotification('no changes');
					this.router.navigateByUrl('/employees');
				}
			});

		} else {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update Employee', 'message': 'There are something changed, Are you sure you want to update employee data?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.EmployeesService.updateemployee(this.oldEmployee.employeeID, _Employee).subscribe(res => {
						if (res.result == true) {
							this.layoutUtilsService.showActionNotification('Employee has been succefully saved');
							this.router.navigateByUrl('/employees');
						} else {
							this.errorMessage = res.message
							this.cdr.detectChanges()
						}


					},
						error => {

							this.errorMessage = error.error;
							this.cdr.detectChanges()

						})


				}
			});
		}
	}
	/**
 * Add Employee
 *
 * @param _Employee: Employee
 * @param withBack: boolean
 */
	addEmployee(_Employee: Employee, withBack: boolean = false) {
		if(_Employee.password==null||_Employee.password==''){
		   this.errorMessage='Please enter password';
		   return;
		}
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add Employee', 'message': ' Are you sure you want to add employee?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.EmployeesService.addNewemployee(_Employee).subscribe(res => {
					if (res.result == true) {
						this.layoutUtilsService.showActionNotification('Employee has been succefully saved');
						this.router.navigateByUrl('/employees');
					} else {
						this.errorMessage = res.message
					}


				},
					error => {

						this.errorMessage = error.error || error.statusText;
						this.cdr.detectChanges()
					})
			}
		});
	}
	/**
 * Returns component title
 */
	getComponentTitle() {
		let result = 'Create Employee';
		if (!this.Employee || !this.Employee.employeeID) {
			return result;
		}

		result = `Edit Employee - ${this.Employee.fullNameArabic}`;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.errorMessage = '';
	}
}

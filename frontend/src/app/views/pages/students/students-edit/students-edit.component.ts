import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import {  Observable, of, Subscription } from 'rxjs';

//validation
import { CustomValidators } from 'ng2-validation';
// Layout
import { SubheaderService } from '../../../../core/_base/layout';
import { LayoutUtilsService} from '../../../../core/_base/crud';
//student
import { StudentService } from '../../../../core/auth/_services/students.sevice';
import { Student } from '../../../../core/auth/_models/students.model';

// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component';
//angular material
import { MatDialog } from '@angular/material';




@Component({
	selector: 'kt-students-edit',
	templateUrl: './students-edit.component.html',
})
export class StudentsEditComponent implements OnInit {

	// Public properties
	Student: Student;
	oldStudent: Student;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	studentsType = ['individual', 'corporate', 'univeristy'];
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

	
	
	StudentForm: FormGroup;
	loading=false;
	hasFormErrors: boolean = false;
	errorMessage: string = '';
	// Private properties
	private subscriptions: Subscription[] = [];

	// validation properties
	numberNotAllowedRegx = /^([^0-9]*)$/;
	specialCharsNotAllowed = /^[^+!@#$_%,.`-]*$/;
	numbersOnly = "^[0-9]*$";


	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param StudentFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private StudentFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private StudentService: StudentService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];

			if (id && id > 0) {
				let student = this.StudentService.getStudentByID(id).subscribe(res => {
					if (res.result == true) {
						this.Student = res.data;
						this.oldStudent = Object.assign({}, this.Student);
						this.initStudent()

					}
					this.subscriptions.push(student)
				});

			} else {
				this.Student = new Student();
				this.Student.clear();
				this.oldStudent = Object.assign({}, this.Student);
				this.initStudent();
			}
		});

		this.subscriptions.push(routeSubscription)
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
		this.loading=false
	}

	/**
	 * Init Student
	 */
	initStudent() {
		this.createForm();
		if (!this.Student.studentID) {
			this.subheaderService.setTitle('Create Student');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Student', page: `students` },
				{ title: 'Students', page: `students` },
				{ title: 'Create Student', page: `students/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Student');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Student ', page: `students` },
			{ title: 'Students', page: `students` },
			{ title: 'Edit Student', page: `students/edit`, queryParams: { id: this.Student.studentID } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.StudentForm = this.StudentFB.group({
			fullNameArabic: [this.Student.fullNameArabic, [Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed), Validators.minLength(3)]],
			fullNameEnglish: [this.Student.fullNameEnglish, [Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed), Validators.minLength(3)]],
			nationalID: [this.Student.nationalID, [Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([14, 14])]],
			mobile1: [this.Student.mobile1, [Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]],
			mobile2: [this.Student.mobile2, [Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]],
			email: [this.Student.email, [Validators.required, CustomValidators.email]],
			gender: [this.Student.gender, Validators.required],
			studentsType: [this.Student.studentsType, Validators.required],
			city: [this.Student.city, Validators.required],
			address: [this.Student.address],
			password: [this.Student.password, Validators.required],
		
		});
	}



	//get branch name



	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/students`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh Student
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshStudent(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/students/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.Student = Object.assign({}, this.oldStudent);
		this.createForm();
		this.hasFormErrors = false;
		this.StudentForm.markAsPristine();
		this.StudentForm.markAsUntouched();
		this.StudentForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.loading=true
		if (this.selectedTab == 0) {
			this.hasFormErrors = false;
			const controls = this.StudentForm.controls;
			/** check form */
			if (this.StudentForm.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);

				this.hasFormErrors = true;
				this.errorMessage = 'Please check invalid fields'
				this.selectedTab = 0;
				return;
			}

			const editedStudent = this.prepareStudent();
			delete editedStudent.studentID;
			if (this.oldStudent.studentID > 0) {
				this.updateStudent(editedStudent, withBack);
				return;
			}

			this.addStudent(editedStudent, withBack);
		}
		

	}

	/**
	 * Returns prepared data for save
	 */
	prepareStudent(): Student {
		const controls = this.StudentForm.controls;
		const _Student = new Student();
		_Student.clear();
 		_Student.fullNameArabic = controls['fullNameArabic'].value;
		_Student.fullNameEnglish = controls['fullNameEnglish'].value;
		_Student.email = controls['email'].value;
		if (controls['nationalID'].value == '' || !controls['nationalID'].value) {
			delete _Student.nationalID
		} else {
			_Student.nationalID = controls['nationalID'].value;
		}

		_Student.mobile1 = controls['mobile1'].value;
		if (controls['mobile2'].value == '' || !controls['mobile2'].value ) {
			delete _Student.mobile2
		} else {
			_Student.mobile2 = controls['mobile2'].value;
		}
		if (controls['address'].value == '' || !controls['address'].value ) {
			delete _Student.address
		} else {
			_Student.address = controls['address'].value;
		}
		_Student.studentsType = controls['studentsType'].value;
		
		_Student.employeeID = JSON.parse(localStorage.getItem('currentUser')).employeeID;
		_Student.branchID = JSON.parse(localStorage.getItem('currentUser')).branchID;
		_Student.gender = controls['gender'].value;
		_Student.city = controls['city'].value;
		_Student.password=controls['password'].value;
		return _Student;
	}

	/**
	 * Add Student
	 *
	 * @param _Student: Student
	 * @param withBack: boolean
	 */
	updateStudent(_Student: Student, withBack: boolean = false) {
		//Check if nothing changed
		
		if (_Student.branchID == this.oldStudent.branchID && _Student.fullNameArabic == this.oldStudent.fullNameArabic &&
			_Student.fullNameEnglish == this.oldStudent.fullNameEnglish && _Student.gender == this.oldStudent.gender &&
			_Student.mobile1 == this.oldStudent.mobile1 && _Student.mobile2 == this.oldStudent.mobile2 &&
			_Student.nationalID == this.oldStudent.nationalID &&
			_Student.studentsType == this.oldStudent.studentsType && _Student.address == this.oldStudent.address &&
			_Student.email == this.oldStudent.email && _Student.employeeID == this.oldStudent.employeeID && _Student.city == this.oldStudent.city
		) {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update Student', 'message': 'There are no changes, Are you sure you want to exit?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.layoutUtilsService.showActionNotification('no changes');
					this.loading=false
					this.router.navigateByUrl('/students')
					this.cdr.detectChanges();
				}
			});

		} else {
			const dialogRef = this.dialog.open(AlertComponentComponent, {
				width: '40%',
				data: { 'title': 'Update Student', 'message': 'There are something changed, Are you sure you want to update user data?' },
			});
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.loading=false
					const updateStudents = this.StudentService.updateStudent(this.oldStudent.studentID, _Student).subscribe(res => {
						if (res.result == true) {
							this.layoutUtilsService.showActionNotification('Student has been succefully saved');
							this.router.navigateByUrl('/students')
							this.cdr.detectChanges();
						} else {
							this.errorMessage = res.message;
							this.cdr.detectChanges()
						}

					},
						error => {
							this.errorMessage = error.error;
							this.cdr.detectChanges()

						})
					this.subscriptions.push(updateStudents)

				}
			});
		}
	}

	/**
	 * Update Student
	 *
	 * @param _Student: Student
	 * @param withBack: boolean
	 */
	addStudent(_Student: Student, withBack: boolean = false) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add Student', 'message': ' Are you sure you want to add student?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.loading=false
				this.StudentService.addNewStudent(_Student).subscribe(res => {
					if (res.result == true) {
						this.layoutUtilsService.showActionNotification('Student has been succefully saved');
						this.router.navigateByUrl('/students')
						this.cdr.detectChanges();
					} else {
						this.errorMessage = res.message;
						this.cdr.detectChanges();
					}
				},
					error => {
						this.errorMessage = error.error;
						this.cdr.detectChanges()
					})
			}
		});
	}

	

	/**
	 * Returns component title
	 */ 
	getComponentTitle() {
		let result = 'Create Student';
		if (!this.Student || !this.Student.studentID) {
			return result;
		}

		result = `Edit Student - ${this.Student.fullNameArabic}`;
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

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import {  Observable,  Subscription } from 'rxjs';

//validation
import { CustomValidators } from 'ng2-validation';
// Layout
import { SubheaderService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';
//student
import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';
//branches


// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog} from '@angular/material';
import { Employee } from '../../../../core/auth/_models/employees.model';
import { EmployeesService } from '../../../../core/auth/_services/employees.service';

@Component({
  selector: 'kt-trainer-edit',
  templateUrl: './trainer-edit.component.html',
})
export class TrainerEditComponent implements OnInit,OnDestroy {
  trainer: Trainer;
 
	trainerId$: Observable<number>;
	oldTrainer: Trainer;
  selectedTab: number = 0;
  allEmployees:Employee[];
	loading$: Observable<boolean>;
	contractsType = ['full time', 'part time'];
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
  trainerForm: FormGroup;
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
		private trainerFb: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
    private trainersService: TrainersService,
    private employeeService: EmployeesService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
		) { }

    ngOnInit() {
      
      const routeSubscription = this.activatedRoute.params.subscribe(params => {
        const id = params['id'];
        if (id && id > 0) {
          const addSubscription = this.trainersService.getTrainerByID(id).subscribe(res => {
            if (res.result==true) {
              this.trainer = res.data;
              this.editPassword = false;
              this.oldTrainer = Object.assign({}, this.trainer);
              this.initTrainer()
            }else{
              this.errorMessage=res.message
            }
          },error=>{
                this.errorMessage=error.error
          }
          );
          this.subscriptions.push(addSubscription);
        } else {
          this.trainer = new Trainer();
          this.trainer.clear();
          this.editPassword = true;
          this.oldTrainer = Object.assign({}, this.trainer);
          this.initTrainer();
        }
      });
      this.subscriptions.push(routeSubscription);
    }
    
    ngOnDestroy() {
      this.subscriptions.forEach(sb => sb.unsubscribe());
    }
    initTrainer() {
      this.createForm();
      if (!this.trainer.trainerID) {
        this.subheaderService.setTitle('Create Trainer');
        this.subheaderService.setBreadcrumbs([
          { title: 'Trainers', page: `trainers` },
          { title: 'Create Trainer', page: `trainers/add` }
        ]);
        return;
      }
      this.subheaderService.setTitle('Edit Trainer');
      this.subheaderService.setBreadcrumbs([
        { title: 'Trainers', page: `trainers` },
        { title: 'Edit Trainer', page: `trainers/edit`, queryParams: { id: this.trainer.trainerID } }
      ]);
    }
  
    /**
     * Create form
     */
    createForm() {
      this.trainerForm = this.trainerFb.group({
        fullNameArabic: [this.trainer.fullNameArabic, [Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed), Validators.minLength(3)]],
        fullNameEnglish: [this.trainer.fullNameEnglish, [Validators.required, Validators.pattern(this.numberNotAllowedRegx), Validators.pattern(this.specialCharsNotAllowed), Validators.minLength(3)]],
        nationalID: [this.trainer.nationalID, [Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([14, 14])]],
        mobile1: [this.trainer.mobile1, [Validators.required, Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]],
        mobile2: [this.trainer.mobile2, [Validators.pattern(this.numbersOnly), CustomValidators.rangeLength([11, 11])]],
        email: [this.trainer.email, [Validators.required, CustomValidators.email]],
        gender: [this.trainer.gender, Validators.required],
        contractType: [this.trainer.contractType, Validators.required],
        city: [this.trainer.city, Validators.required],
        address: [this.trainer.address, Validators.required],
        password: ['', [Validators.pattern('^([a-z0-9A-Z]*)$')]],
      });
    }
  
  
  
    /**
     * Redirect to list
     *
     */
    goBackWithId() {
      const url = `/trainers`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    }
  
    /**
     * Refresh Student
     *
     * @param isNew: boolean
     * @param id: number
     */
    refreshTrainer(isNew: boolean = false, id = 0) {
      let url = this.router.url;
      if (!isNew) {
        this.router.navigate([url], { relativeTo: this.activatedRoute });
        return;
      }
  
      url = `/trainers/edit/${id}`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    }
  
    /**
     * Reset
     */
    reset() {
      this.trainer = Object.assign({}, this.oldTrainer);
      this.createForm();
      this.hasFormErrors = false;
      this.trainerForm.markAsPristine();
      this.trainerForm.markAsUntouched();
      this.trainerForm.updateValueAndValidity();
    }
  
    /**
     * Save data
     *
     * @param withBack: boolean
     */
    onSumbit(withBack: boolean = false) {
      if (this.selectedTab == 0) {
        this.hasFormErrors = false;
        const controls = this.trainerForm.controls;
        /** check form */
        if (this.trainerForm.invalid) {
          Object.keys(controls).forEach(controlName =>
            controls[controlName].markAsTouched()
          );
  
          this.hasFormErrors = true;
          this.errorMessage = 'Please check invalid fields'
          this.selectedTab = 0;
          return;
        }
  
        const editedTrainer = this.prepareTrainer();
        delete editedTrainer.trainerID;
        if (this.oldTrainer.trainerID > 0) {
          this.updateTrainer(editedTrainer, withBack);
          return;
        }
  
        this.addTrainer(editedTrainer, withBack);
      }
  
    }
  
    /**
     * Returns prepared data for save
     */
    prepareTrainer(): Trainer {
      const controls = this.trainerForm.controls;
      const _trainer = new Trainer();
      _trainer.clear();
      _trainer.fullNameArabic = controls['fullNameArabic'].value;
      _trainer.fullNameEnglish = controls['fullNameEnglish'].value;
      _trainer.email = controls['email'].value;
      _trainer.nationalID = controls['nationalID'].value;
      _trainer.mobile1 = controls['mobile1'].value;
      _trainer.mobile2 = controls['mobile2'].value;
      _trainer.contractType = controls['contractType'].value;
      _trainer.address = controls['address'].value;
      _trainer.employeeID = JSON.parse(localStorage.getItem('currentUser')).employeeID;
      _trainer.gender = controls['gender'].value;
      _trainer.city = controls['city'].value;
      _trainer.password = controls['password'].value;
		
      return _trainer;
    }
  
    
    updateTrainer(_trainer: Trainer, withBack: boolean = false) {
      //Check if nothing changed
      delete _trainer.password
      if (
        _trainer.fullNameArabic == this.oldTrainer.fullNameArabic &&
        _trainer.fullNameEnglish == this.oldTrainer.fullNameEnglish && 
        _trainer.gender == this.oldTrainer.gender &&
        _trainer.mobile1 == this.oldTrainer.mobile1 &&
         _trainer.mobile2 == this.oldTrainer.mobile2 &&
        _trainer.nationalID == this.oldTrainer.nationalID && 
        _trainer.contractType == this.oldTrainer.contractType &&
        _trainer.address == this.oldTrainer.address &&
        _trainer.email == this.oldTrainer.email &&
         _trainer.city == this.oldTrainer.city
      ) {
        const dialogRef = this.dialog.open(AlertComponentComponent, {
          width: '40%',
          data: { 'title': 'Update Trainer', 'message': 'There are no changes, Are you sure you want to exit?' },
        });
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            return;
          } else {
            this.layoutUtilsService.showActionNotification('no changes')
            this.router.navigateByUrl('/trainers');
          }
        });
  
      } else {
        const dialogRef = this.dialog.open(AlertComponentComponent, {
          width: '40%',
          data: { 'title': 'Update Trainer', 'message': 'There are something changed, Are you sure you want to update Trainer data?' },
        });
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            return;
          } else {
            const addSubscription = this.trainersService.updateTrainer(this.oldTrainer.trainerID, _trainer).subscribe(res => {
              if(res.result==true){
                this.layoutUtilsService.showActionNotification('Trainer has been succefully saved');
                this.router.navigateByUrl('/trainers');
                this.subscriptions.push(addSubscription);
              }else{
                this.errorMessage=res.message
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
  
    
    addTrainer(_trainer: Trainer, withBack: boolean = false) {
      if(_trainer.password==null||_trainer.password==''){
        this.errorMessage='Please enter password';
        return;
     }
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Add Trainer', 'message': ' Are you sure you want to add Trainer?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          const addSubscription = this.trainersService.addNewTrainer(_trainer).subscribe(res => {
            if(res.result==true){
            this.layoutUtilsService.showActionNotification('Trainer has been succefully saved');
            this.router.navigateByUrl('/trainers');
            this.subscriptions.push(addSubscription);
          }else{
            this.errorMessage=res.message
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
      let result = 'Create Trainer';
      if (!this.trainer || !this.trainer.trainerID) {
        return result;
      }
  
      result = `Edit Trainer - ${this.trainer.fullNameArabic}`;
      return result;
    }
  
    /**
     * Close Alert
     *
     * @param $event: Event
     */
    onAlertClose($event) {
      this.errorMessage='';
    }
}

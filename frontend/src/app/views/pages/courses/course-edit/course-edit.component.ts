import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Subscription } from 'rxjs';

// Layout
import { SubheaderService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';

import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';

import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';


import { ProvidersService } from '../../../../core/auth/_services/providers.service';
import { provider } from '../../../../core/auth/_models/providers.models';

// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog } from '@angular/material';


@Component({
  selector: 'kt-course-edit',
  templateUrl: './course-edit.component.html',
})
export class CourseEditComponent implements OnInit, OnDestroy {

  course: Course;
  oldCourse: Course;
  selectedTab: number = 0;
  allproviders: provider[];
  tracks: Track[];
  courseForm: FormGroup;
  hasFormErrors: boolean = false;
  errorMessage: string = '';
  // Private properties
  private subscriptions: Subscription[] = [];

  // validation properties
  numberNotAllowedRegx = /^([^0-9]*)$/;
  specialCharsNotAllowed = /^[^+!@#$_%,.`-]*$/;
  numbersOnly = "^[0-9]*$";
  courseTracks = [];
  TotalPrice = 0;
  TotalHours = 0;
  priceAfterDiscount: number = 0;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private courseFb: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private coursesService: CoursesService,
    private tracksService: TracksService,
    private providersService: ProvidersService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,

  ) { }


  ngOnInit() {
    this.getAllProviders();
    this.getAllTracks();
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id && id > 0) {
        const addSubscription = this.coursesService.getCourseByID(id).subscribe(res => {
          if (res.result == true) {
            this.course = res.data;
            this.oldCourse = Object.assign({}, this.course);
            this.initCourse()

          }
        });
        this.subscriptions.push(addSubscription);
      } else {
        this.course = new Course();
        this.course.clear();
        this.oldCourse = Object.assign({}, this.course);
        this.initCourse();
      }
    });
    this.subscriptions.push(routeSubscription);
  }

  getAllProviders() {
    const addSubscription = this.providersService.getProviders().subscribe(res => {
      if (res.result == true) {
        this.allproviders = res.data;
        this.cdr.detectChanges()
      }

    })
    this.subscriptions.push(addSubscription);
  }
  getAllTracks() {
    const addSubscription = this.tracksService.getTracks().subscribe(res => {
      if (res.result == true) {
        this.tracks = res.data;
      }

    })
    this.subscriptions.push(addSubscription);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  initCourse() {
    this.createForm();
    if (!this.course.courseID) {
      this.subheaderService.setTitle('Create Course');
      this.subheaderService.setBreadcrumbs([
        { title: 'Courses', page: `courses` },
        { title: 'Create Courses', page: `courses/add` }
      ]);

      return;
    }
    console.log('this.course.courseTracks',this.course.courseTracks)
    if (this.course.courseTracks.length > 0) {
      for (let i = 0; i < this.course.courseTracks.length; i++) {
        this.courseTracks.push(this.course.courseTracks[i].trackID);
      }

    }

    this.subheaderService.setTitle('Edit Cource');
    this.subheaderService.setBreadcrumbs([
      { title: 'Courses', page: `courses` },
      { title: 'Edit Course', page: `courses/edit`, queryParams: { id: this.course.courseID } }
    ]);
  }

  createForm() {
    this.courseForm = this.courseFb.group({
      courseName: [this.course.courseName, [Validators.required, Validators.minLength(3)]],
      courseDesc: [this.course.courseDesc, Validators.required],
      providerID: [this.course.providerID, Validators.required],
      courseTracks: [this.courseTracks, Validators.required],
      discount: [this.course.discount, [Validators.pattern(this.numbersOnly), Validators.min(0), Validators.max(100), Validators.required]],
      coursePrice: [this.course.coursePrice, [Validators.pattern(this.numbersOnly), Validators.required]],
      courseHours: [this.course.courseHours, [Validators.pattern(this.numbersOnly), Validators.required]],
      priceAfterDiscount: [this.course.priceAfterDiscount, [Validators.pattern(this.numbersOnly), Validators.required]],
    });
  }



  /**
   * Redirect to list
   *
   */
  goBackWithId() {
    const url = `/courses`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }




  /**
   * Reset
   */
  reset() {
    this.course = Object.assign({}, this.oldCourse);
    this.createForm();
    this.hasFormErrors = false;
    this.courseForm.markAsPristine();
    this.courseForm.markAsUntouched();
    this.courseForm.updateValueAndValidity();
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSumbit(withBack: boolean = false) {
    if (this.selectedTab == 0) {
      this.hasFormErrors = false;
      const controls = this.courseForm.controls;
      /** check form */
      if (this.courseForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );

        this.hasFormErrors = true;
        this.errorMessage = 'Please check invalid fields'
        this.selectedTab = 0;
        return;
      }

      const editedCourse = this.prepareCourse();

      delete editedCourse.courseID;

      if (this.oldCourse.courseID > 0) {
        this.updateCourse(editedCourse, withBack);
      } else {
        this.addCourse(editedCourse, withBack);
      }
    }

  }

  /**
   * Returns prepared data for save
   */
  prepareCourse(): Course {
    const controls = this.courseForm.controls;
    const _course = new Course();
    _course.courseName = controls['courseName'].value;
    _course.courseDesc = controls['courseDesc'].value;
    _course.discount = controls['discount'].value;
    _course.employeeID = JSON.parse(localStorage.getItem('currentUser')).employeeID;
    _course.providerID = controls['providerID'].value;
    _course.courseTracks = controls['courseTracks'].value;
    _course.courseTracks = []
    for (let i = 0; i < controls['courseTracks'].value.length; i++) {
      _course.courseTracks.push({ 'trackID': controls['courseTracks'].value[i] })

    }
    _course.courseHours = controls['courseHours'].value;
    _course.coursePrice = controls['coursePrice'].value;
    _course.priceAfterDiscount = controls['priceAfterDiscount'].value;


    return _course;
  }


  updateCourse(_course: Course, withBack: boolean = false) {
    //Check if nothing changed ha
    if (
      _course.courseName == this.oldCourse.courseName &&
      _course.courseDesc == this.oldCourse.courseDesc &&
      _course.courseTracks == this.oldCourse.courseTracks &&
      _course.providerID == this.oldCourse.providerID &&
      _course.discount == this.oldCourse.discount &&
      _course.coursePrice == this.oldCourse.coursePrice &&
      _course.courseHours == this.oldCourse.courseHours

    ) {
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Course', 'message': 'There are no changes, Are you sure you want to exit?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          this.layoutUtilsService.showActionNotification('no changes')
          this.router.navigateByUrl('/courses');
        }
      });

    } else {

      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Course', 'message': 'There are something changed, Are you sure you want to update Trainer data?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {

          const addSubscription = this.coursesService.updateCourse(this.oldCourse.courseID, _course).subscribe(res => {
            if (res.result == true) {
              this.layoutUtilsService.showActionNotification('Course has been succefully saved');
              this.router.navigateByUrl('/courses');

            } else {
              this.errorMessage = res.message
            }
            this.subscriptions.push(addSubscription);
          },
            error => {
              this.errorMessage = error.error || error.statusText;
              this.cdr.detectChanges()

            })

        }

      });

    }
  }


  addCourse(_course: Course, withBack: boolean = false) {

    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Add Course', 'message': ' Are you sure you want to add Course?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {

        const addSubscription = this.coursesService.addNewCourse(_course).subscribe(res => {
          if (res.result == true) {
            this.layoutUtilsService.showActionNotification('Course has been succefully saved');
            this.router.navigateByUrl('/courses');

          } else {
            this.errorMessage = res.message
          }
          this.subscriptions.push(addSubscription);
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
    let result = 'Create Course';
    if (!this.course || !this.course.courseID) {
      return result;
    }

    result = `Edit Course - ${this.course.courseName}`;
    return result;
  }


  calculateTotal() {
    let courseTracks = []
    let track
    if (this.courseForm.controls['courseTracks'].value.length > 0) {
      for (let i = 0; i < this.courseForm.controls['courseTracks'].value.length; i++) {
        track = this.tracks.find(Track => Track.trackID === this.courseForm.controls['courseTracks'].value[i]);
        courseTracks.push(track);
        this.TotalPrice = courseTracks.reduce((a, b) => +a + +b.price, 0);
        this.courseForm.controls['coursePrice'].setValue(this.TotalPrice);
        this.TotalHours = courseTracks.reduce((a, b) => +a + +b.trackHours, 0);
        this.courseForm.controls['courseHours'].setValue(this.TotalHours);
        this.priceAfterDiscount = this.courseForm.controls['coursePrice'].value - ((this.courseForm.controls['discount'].value / 100) * this.courseForm.controls['coursePrice'].value);
        this.courseForm.controls['priceAfterDiscount'].setValue(this.priceAfterDiscount);
      }
    } else {
      this.TotalHours = 0;
      this.TotalPrice = 0;
      this.courseForm.controls['coursePrice'].setValue(this.TotalPrice);
      this.courseForm.controls['courseHours'].setValue(this.TotalHours)
    }
  }

  changeDiscount(){
    this.priceAfterDiscount = this.courseForm.controls['coursePrice'].value - ((this.courseForm.controls['discount'].value / 100) * this.courseForm.controls['coursePrice'].value);
    this.courseForm.controls['priceAfterDiscount'].setValue(this.priceAfterDiscount);
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

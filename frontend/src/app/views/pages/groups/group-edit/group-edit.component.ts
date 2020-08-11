import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

// RxJS
import { Observable, Subscription } from 'rxjs';

 
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';


import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';


import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { Course } from '../../../../core/auth/_models/Courses.model';


import { GroupsService } from '../../../../core/auth/_services/group.service';
import { Group } from '../../../../core/auth/_models/group.model';

//branches


// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog} from '@angular/material';
import { EmployeesService } from '../../../../core/auth/_services/employees.service'


//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';

@Component({
  selector: 'kt-group-edit',
  templateUrl: './group-edit.component.html'
})
export class GroupEditComponent implements OnInit, OnDestroy {
  group: Group;
  groupId$: Observable<number>;
  oldGroup: Group;
  selectedTab: number = 0;
  allCourses: Course[];
  trainerList: Trainer[];
  trackList: Track[];
  loading$: Observable<boolean>;
  groupForm: FormGroup;
  hasFormErrors: boolean = false;
  errorMessage: string = '';
  allBranches: Branch[];
  isAdmin:boolean=false;
  // Private properties
  private subscriptions: Subscription[] = [];


  // validation properties
  numberNotAllowedRegx = /^([^0-9]*)$/;
  specialCharsNotAllowed = /^[^+!@#$_%,.`-]*$/;
  numbersOnly = /^([0-9]{2})\:([0-9]{2})$/;
  courseTracks = [];
  daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  class = ['lab1', 'lab2', 'lab3', 'lab4', 'lab5', 'lab6', 'lab7']
  groupType = ['ClassRoom', 'Online']
  groupStatus = ['pending', 'working', 'completed','waiting']

  selectedgroupType = 'Online'

  selectedPublictrainer = 0
  // get groupSchedule(): FormArray {

  // return this.groupForm.get('groupSchedule') as FormArray;
  //}
  days;
  Hourfrom;
  Hourto;
  trainerID;
  trackID;
  trainerPricePerHour;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private coursesService: CoursesService,
    private employeeService: EmployeesService,
    private tracksService: TracksService,
    private trainersService: TrainersService,
    private groupsService: GroupsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private layoutConfigService: LayoutConfigService,
    private branchesService: branchesService,

  ) { } 


  ngOnInit() {

    if(JSON.parse(localStorage.getItem('currentUser')).role=='Admin'){
       this.isAdmin=true
       this.getAllBranches();
    }
    
    this.getAllCourses();
    //this.getAllTracks();
    this.getAllTrainers();
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id && id > 0) {
        const addSubscription = this.groupsService.getGroupByID(id).subscribe(res => {
          if (res.result == true) {
            this.group = res.group;
            this.selectedCourse = this.group.courseID;
            this.selectedgroupType = this.group.groupType.toString();
            this.filterByCourse();
            this.oldGroup = Object.assign({}, this.group);
            this.initGroup()

          }
        });
        this.subscriptions.push(addSubscription);
      } else {
        this.group = new Group();
        this.group.clear();
        this.oldGroup = Object.assign({}, this.group);
        this.initGroup();
      }
    });

    this.subscriptions.push(routeSubscription);
  }

  getAllCourses() {
    const addSubscription = this.coursesService.getCourses().subscribe(res => {
      if (res.result == true)
        this.allCourses = res.data;
    })
    this.subscriptions.push(addSubscription);
  }
  
  selectedCourse;

  filterByCourse() {
    let courseID= this.allCourses.find(p => p.courseID == this.selectedCourse)
    this.coursesService.getCourseByID(courseID.courseID).subscribe(res=>{
      if (res.result== true){
        this.trackList=res.tracks
      }
    })
   // this.trackList = this.allCourses.find(p => p.courseID == this.selectedCourse)
  }
  getAllTrainers() {
    const addSubscription = this.trainersService.getTrainers().subscribe(res => {
      if (res.result == true) {
        this.trainerList = res.data;
      }

    })
    this.subscriptions.push(addSubscription);
  }

  getAllBranches() {
    let branches = this.branchesService.getBranches().subscribe(res => {
      if (res.result == true) {
		this.allBranches = res.data;
		this.cdr.detectChanges()
      }
    })
    this.subscriptions.push(branches)
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  initGroup() {
    this.createForm();
    if (!this.group.groupID) {
      this.subheaderService.setTitle('Create Group');
      this.subheaderService.setBreadcrumbs([
        { title: 'Groups', page: `groups` },
        { title: 'Create Group', page: `groups/add` }
      ]);

      return;
    }

    if (this.group.groupSchedule.length) {
      for (let i = 0; i <= this.group.groupSchedule.length - 1; i++) {
        this.days = this.group.groupSchedule[i].days;
        this.Hourfrom = this.group.groupSchedule[i].Hourfrom;
        this.Hourto = this.group.groupSchedule[i].Hourto;

        (this.groupForm.get('groupSchedule') as FormArray).push(this.getgroupSchedule());
      }
    }


    if (this.group.groupTracks.length) {
      for (let i = 0; i <= this.group.groupTracks.length - 1; i++) {
        this.trainerID = this.group.groupTracks[i].trainerID;
        this.trackID = this.group.groupTracks[i].trackID;
         this.trainerPricePerHour=this.group.groupTracks[i].trainerPricePerHour;;

        (this.groupForm.get('groupTracks') as FormArray).push(this.getgroupTrauks());
      }
    }

    this.subheaderService.setTitle('Edit Groups');
    this.subheaderService.setBreadcrumbs([
      { title: 'Groups', page: `groups` },
      { title: 'Edit Groups', page: `groups/edit`, queryParams: { id: this.group.groupID } }
    ]);
  }
  getgroupSchedule(): FormGroup {

    return this.fb.group({
      days: [this.days, Validators.required],
      Hourfrom: [this.Hourfrom, [Validators.required, Validators.pattern(this.numbersOnly)]],
      Hourto: [this.Hourto, [Validators.required, Validators.pattern(this.numbersOnly)]]

    })

  }

  getgroupTrauks(): FormGroup {

    return this.fb.group({
      trackID: [this.trackID, Validators.required],
      trainerID: [this.trainerID, Validators.required],
      trainerPricePerHour:[this.trainerPricePerHour, Validators.required]

    })

  }
  createForm() {

    this.groupForm = this.fb.group({
      groupStatus: [this.group.groupStatus, Validators.required],
      class: [this.group.class],
      groupType: [this.group.groupType, Validators.required],
      courseID: [this.group.courseID, Validators.required],
      groupSchedule: this.fb.array([]),
      groupTracks: this.fb.array([]),
      groupStartDate: [this.group.groupStartDate, Validators.required],
      branchID: [this.group.branchID],

    });
  }

dd

  /**
   * Redirect to list
   *
   */
  goBackWithId() {
    const url = `/groups`;
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

    url = `/groups/edit/${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  /**
   * Reset
   */
  reset() {
    this.group = Object.assign({}, this.oldGroup);
    this.createForm();
    this.hasFormErrors = false;
    this.groupForm.markAsPristine();
    this.groupForm.markAsUntouched();
    this.groupForm.updateValueAndValidity();
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSumbit(withBack: boolean = false) {
    if (this.selectedTab == 0) {
      this.hasFormErrors = false;
      const controls = this.groupForm.controls;
      /** check form */
      if (this.groupForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );

        this.hasFormErrors = true;
        this.errorMessage = 'Please check invalid fields'
        return;
      }

      const editedGroup = this.prepareGroup();

      delete editedGroup.groupID;

      delete editedGroup.groupName;
      delete editedGroup.groupEndDate

      if (this.selectedgroupType == 'Online') {
        delete editedGroup.class
      }
      if (this.oldGroup.groupID > 0) {
        this.updateGroup(editedGroup, withBack);
        return;
      }

      this.addGroup(editedGroup, withBack);
    }

  }

  /**
   * Returns prepared data for save
   */
  prepareGroup(): Group {
    const controls = this.groupForm.controls;
    const _group = new Group();
    _group.clear();
    _group.groupStartDate = controls['groupStartDate'].value;
    _group.groupStatus = controls['groupStatus'].value;
    _group.groupType = controls['groupType'].value;
    _group.courseID = controls['courseID'].value;
    if(JSON.parse(localStorage.getItem('currentUser')).role=='Admin'){
      _group.branchID = controls['branchID'].value;
    }else{
      _group.branchID = JSON.parse(localStorage.getItem('currentUser')).branchID;
    }
    
    _group.employeeID = JSON.parse(localStorage.getItem('currentUser')).employeeID;
    _group.class = controls['class'].value;
    _group.groupSchedule = controls['groupSchedule'].value;

    _group.groupTracks = controls['groupTracks'].value;
    return _group;
  }


  updateGroup(_group: Group, withBack: boolean = false) {
    //Check if nothing changed ha

    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Update Groups', 'message': 'There are something changed, Are you sure you want to update Groups data?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {

        const addSubscription = this.groupsService.updateGroup(this.oldGroup.groupID, _group).subscribe(res => {
          if (res.result == true) {
            this.layoutUtilsService.showActionNotification('Group has been succefully saved');
            this.router.navigateByUrl('/groups');
            this.subscriptions.push(addSubscription);
          } else {
            this.errorMessage = res.message
          }

        },
          error => {
            console.log(error)
            this.errorMessage = error.error || error.statusText;
            this.cdr.detectChanges()

          })

      }
    });

  }


  addGroup(_group: Group, withBack: boolean = false) {
    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Add Group', 'message': ' Are you sure you want to add Group?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        const addSubscription = this.groupsService.addNewGroup(_group).subscribe(res => {
          if (res.result == true) {
            this.layoutUtilsService.showActionNotification('groups has been succefully saved');
            this.router.navigateByUrl('/groups');
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
    let result = 'Create Group';
    if (!this.group || !this.group.groupID) {
      return result;
    }

    result = `Edit Group - ${this.group.groupName}`;
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

  addNewGroupSchedule(): void {
    (this.groupForm.get('groupSchedule') as FormArray).push(this.getgroupSchedule());
  }

  addItem(): void {

    (this.groupForm.get('groupSchedule') as FormArray).push(this.getgroupSchedule());

 
  }

  addNewgroupTracks(): void {
    (this.groupForm.get('groupTracks') as FormArray).push(this.getgroupTrauks());
  }

  addTrackItem(): void {

    (this.groupForm.get('groupTracks') as FormArray).push(this.getgroupTrauks());


  }

  deleteControl(control, index) {
    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Add Group', 'message': 'Are you sure you want to delete this row?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        (this.groupForm.get('groupSchedule') as FormArray).removeAt(index);
        this.cdr.detectChanges()
      }

    });

    // control.removeAt(index)
  }
  deleteControlTrack(control, index) {
    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Add Group', 'message': 'Are you sure you want to delete this row?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        (this.groupForm.get('groupTracks') as FormArray).removeAt(index);
        this.cdr.detectChanges()
      }

    });

    // control.removeAt(index)
  }
}

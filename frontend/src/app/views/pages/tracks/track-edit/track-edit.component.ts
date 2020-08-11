import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, of, Subscription } from 'rxjs';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService } from '../../../../core/_base/crud';

import { Track } from '../../../../core/auth/_models/Tracks.model';

// Alert Notification 
import { AlertComponentComponent } from '../../alert-component/alert-component/alert-component.component'
//angular material
import { MatDialog } from '@angular/material';
import { TracksService } from '../../../../core/auth/_services/tracks.service';

@Component({
  selector: 'kt-track-edit',
  templateUrl: './track-edit.component.html',
 
})
export class TrackEditComponent implements OnInit,OnDestroy {
  track: Track;
	trackId$: Observable<number>;
	oldtrack: Track;
  selectedTab: number = 0;
  loading$: Observable<boolean>;
  trackForm: FormGroup;
	hasFormErrors: boolean = false;
	errorMessage: string = '';
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
    private tracksService: TracksService,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
		private layoutConfigService: LayoutConfigService) { }

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id && id > 0) {
        const addSubscription = this.tracksService.getTrackByID(id).subscribe(res => {
          if (res.result==true) {
            this.track = res.data;
            this.oldtrack = Object.assign({}, this.track);
            this.initTrack()

          }
        });
        this.subscriptions.push(addSubscription);
      } else {
        this.track = new Track();
        this.track.clear();
        this.oldtrack = Object.assign({}, this.track);
        this.initTrack();
      }
    });
    this.subscriptions.push(routeSubscription);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  initTrack() {
    this.createForm();
    if (!this.track.trackID) {
      this.subheaderService.setTitle('Create Track');
      this.subheaderService.setBreadcrumbs([
        { title: 'Tracks', page: `tracks` },
        { title: 'Create Track', page: `tracks/add` }
      ]);
      return;
    }
    this.subheaderService.setTitle('Edit Track');
    this.subheaderService.setBreadcrumbs([
      { title: 'Tracks', page: `tracks` },
      { title: 'Edit Track', page: `tracks/edit`, queryParams: { id: this.track.trackID } }
    ]);
  }
  createForm() {
    this.trackForm = this.trainerFb.group({
      trackName: [this.track.trackName, [Validators.required]],
      price: [this.track.price, [Validators.required, Validators.pattern(this.numbersOnly),Validators.min(1)]],
      trackHours: [this.track.trackHours, [Validators.required, Validators.pattern(this.numbersOnly),Validators.min(1)]],
      trackOutline: [this.track.trackOutline, Validators.required]
     
    });
  }



  /**
   * Redirect to list
   *
   */
  goBackWithId() {
    const url = `/tracks`;
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

    url = `/tracks/edit/${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  /**
   * Reset
   */
  reset() {
    this.track = Object.assign({}, this.oldtrack);
    this.createForm();
    this.hasFormErrors = false;
    this.trackForm.markAsPristine();
    this.trackForm.markAsUntouched();
    this.trackForm.updateValueAndValidity();
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSumbit(withBack: boolean = false) {
    if (this.selectedTab == 0) {
      this.hasFormErrors = false;
      const controls = this.trackForm.controls;
      /** check form */
      if (this.trackForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );

        this.hasFormErrors = true;
        this.errorMessage = 'Please check invalid fields'
        this.selectedTab = 0;
        return;
      }

      const editedTrack= this.prepareTrainer();
      delete editedTrack.trackID;
      if (this.oldtrack.trackID > 0) {
        this.updateTrack(editedTrack, withBack);
        return;
      }

      this.addTrack(editedTrack, withBack);
    }

  }

  /**
   * Returns prepared data for save
   */
  prepareTrainer(): Track {
    const controls = this.trackForm.controls;
    const _track = new Track();
    _track.clear();
    _track.trackName = controls['trackName'].value;
    _track.price = controls['price'].value;
    _track.trackHours = controls['trackHours'].value;
    _track.trackOutline = controls['trackOutline'].value;
   
    return _track;
  }

  
  updateTrack(_track: Track, withBack: boolean = false) {
    //Check if nothing changed
    
    if (
      _track.trackName == this.oldtrack.trackName &&
      _track.trackHours == this.oldtrack.trackHours && 
      _track.price == this.oldtrack.price &&
      _track.trackOutline == this.oldtrack.trackOutline
    ) {
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Track', 'message': 'There are no changes, Are you sure you want to exit?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          this.layoutUtilsService.showActionNotification('no changes')
         this.router.navigateByUrl('/tracks')
        }
      });

    } else {
      const dialogRef = this.dialog.open(AlertComponentComponent, {
        width: '40%',
        data: { 'title': 'Update Trainer', 'message': 'There are something changed, Are you sure you want to update Track data?' },
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          const addSubscription = this.tracksService.updateTrack(this.oldtrack.trackID, _track).subscribe(res => {
            if(res.result==true){
              this.layoutUtilsService.showActionNotification('Track has been succefully saved');
              this.router.navigateByUrl('/tracks')
            }else{
              this.errorMessage=res.message
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

  
  addTrack(_track: Track, withBack: boolean = false) {
    const dialogRef = this.dialog.open(AlertComponentComponent, {
      width: '40%',
      data: { 'title': 'Add Track', 'message': ' Are you sure you want to add Track?' },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        const addSubscription = this.tracksService.addNewTrack(_track).subscribe(res => {
          if(res.result==true){
            this.layoutUtilsService.showActionNotification('Track has been succefully saved');
          this.router.navigateByUrl('/tracks')
          }else{
            this.errorMessage=res.message
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
    let result = 'Create Track';
    if (!this.track || !this.track.trackID) {
      return result;
    }

    result = `Edit Track - ${this.track.trackName}`;
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

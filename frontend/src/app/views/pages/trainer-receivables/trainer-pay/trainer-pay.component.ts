import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import { TeachingAttendantService } from '../../../../core/auth/_services/teachingAttendant';
import { Group } from '../../../../core/auth/_models/group.model';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-trainer-pay',
  templateUrl: './trainer-pay.component.html',
  styleUrls: ['./trainer-pay.component.scss']
})
export class TrainerPayComponent implements OnInit {

  errorMessage;
  Attendant;
  AttendantForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TrainerPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TeachingAttendantService: TeachingAttendantService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.Attendant = this.data.groupTrack;
    this.createForm()
  }
  onNoClick() {
    this.dialogRef.close();
  }

  createForm() {

    this.AttendantForm = this.fb.group({
      paid: [this.Attendant.trainerPricePerHour*this.Attendant.trainerTotalTeachedHours, Validators.required],
    
    }); 
  } 

  updateAttendant() {
    let newPayment
    
      newPayment = {
        'employeeID':JSON.parse(localStorage.getItem('currentUser')).employeeID ,
        'groupID': this.data.groupID,
        'trainerID': this.Attendant.trainerID,
        'trackID': this.Attendant.trackID,
        'paid': this.AttendantForm.controls['paid'].value
      }
     
    this.TeachingAttendantService.postNewTranerPayment( newPayment).subscribe(res => {
      if (res.result == true) {
        this.dialogRef.close({ res })
      } else {
        this.errorMessage = res.message;
      }

    })
  }

  onAlertClose($event) {
    this.errorMessage = ''
  }



}

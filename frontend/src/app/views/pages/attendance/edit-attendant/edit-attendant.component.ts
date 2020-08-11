import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import { TeachingAttendantService } from '../../../../core/auth/_services/teachingAttendant';
import { teachingAttendant } from '../../../../core/auth/_models/teachingAttendant';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-edit-attendant',
  templateUrl: './edit-attendant.component.html',
  styleUrls: ['./edit-attendant.component.scss']
})
export class EditAttendantComponent implements OnInit {

  errorMessage;
  Attendant: teachingAttendant;
  AttendantForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditAttendantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TeachingAttendantService: TeachingAttendantService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.Attendant = this.data;
    this.createForm()
  }
  onNoClick() {
    this.dialogRef.close();
  }

  createForm() {

    this.AttendantForm = this.fb.group({
      signin: [this.Attendant.signin, Validators.required],
      signOut: [this.Attendant.signOut, Validators.required],
      actualTeachedHours: [this.Attendant.actualTeachedHours],


    });
  }

  updateAttendant() {
    let newAttend
    if (this.AttendantForm.controls['actualTeachedHours'].value && this.AttendantForm.controls['actualTeachedHours'].value != '') {
      newAttend = {
        'signin': this.AttendantForm.controls['signin'].value,
        'signOut': this.AttendantForm.controls['signOut'].value,
        'actualTeachedHours': this.AttendantForm.controls['actualTeachedHours'].value
      }
    } else {
      newAttend = {
        'signin': this.AttendantForm.controls['signin'].value,
        'signOut': this.AttendantForm.controls['signOut'].value,
      }
    }

    this.TeachingAttendantService.adminUpdate(this.Attendant.teacheingAttendantID, newAttend).subscribe(res => {
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

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import { StudentService } from '../../../../core/auth/_services/students.sevice';
import { teachingAttendant } from '../../../../core/auth/_models/teachingAttendant';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-terms-condition-edit',
  templateUrl: './terms-condition-edit.component.html',
  styleUrls: ['./terms-condition-edit.component.scss']
})
export class TermsConditionEditComponent implements OnInit {

  errorMessage;
  Attendant: teachingAttendant;
  TermsForm: FormGroup;
  condition
  constructor(
    public dialogRef: MatDialogRef<TermsConditionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private StudentService: StudentService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    if (this.data!='') {
      this.condition = this.data.Terms
    } else {
      this.condition = ''
    }

    this.createForm()
  }
  onNoClick() {
    this.dialogRef.close();
  }

  createForm() {

    this.TermsForm = this.fb.group({
      terms: [this.condition, Validators.required],


    });
  }

  updateTerms() {

    const controls = this.TermsForm.controls;
    /** check form */
    if (this.TermsForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );


      this.errorMessage = 'Please check invalid fields'
      return;
    }
    if (this.data!='') {
      this.StudentService.updateTerms(this.data.termsID, this.TermsForm.controls['terms'].value).subscribe(res => {
        if (res.result == true) {
          this.dialogRef.close({ res })
        } else {
          this.errorMessage = res.message;
        }

      })
    } else {
      this.StudentService.addNewTerms(this.TermsForm.controls['terms'].value).subscribe(res => {
        if (res.result == true) {
          this.dialogRef.close({ res })
        } else {
          this.errorMessage = res.message;
        }

      })
    }

  }

  onAlertClose($event) {
    this.errorMessage = ''
  }


}

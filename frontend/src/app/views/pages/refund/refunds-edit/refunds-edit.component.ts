import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import {PaymentsService} from '../../../../core/auth/_services/payment.service';
import { teachingAttendant } from '../../../../core/auth/_models/teachingAttendant';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 

@Component({ 
  selector: 'kt-refunds-edit',
  templateUrl: './refunds-edit.component.html',
  styleUrls: ['./refunds-edit.component.scss']
})
export class RefundsEditComponent implements OnInit {

  errorMessage;
  Attendant: teachingAttendant;
  RefundForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RefundsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private PaymentsService: PaymentsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
     console.log(this.data)
    this.createForm()
  }
  onNoClick() {
    this.dialogRef.close();
  }

  createForm() {

    this.RefundForm = this.fb.group({
      status: ['', Validators.required],
     

    });
  }

  updateRefund() {
   
    const controls = this.RefundForm.controls;
    /** check form */
    if (this.RefundForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

     
      this.errorMessage = 'Please check invalid fields'
      return;
    }

    this.PaymentsService.editRefund(this.data, this.RefundForm.controls['status'].value).subscribe(res => {
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

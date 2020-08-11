import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import {TransferService} from '../../../../core/auth/_services/transfer';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-transfer-edit',
  templateUrl: './transfer-edit.component.html',
  styleUrls: ['./transfer-edit.component.scss']
})
export class TransferEditComponent implements OnInit {

  errorMessage;
  
  TransferForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TransferEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TransferService: TransferService,
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

    this.TransferForm = this.fb.group({
      status: ['', Validators.required],
     

    });
  }

  updateRefund() {
   
    const controls = this.TransferForm.controls;
    /** check form */
    if (this.TransferForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

     
      this.errorMessage = 'Please check invalid fields'
      return;
    }

    this.TransferService.adminTransferPermision(this.data, this.TransferForm.controls['status'].value).subscribe(res => {
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

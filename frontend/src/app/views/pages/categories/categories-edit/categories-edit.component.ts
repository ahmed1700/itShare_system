import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';


import { publicPaymentService } from '../../../../core/auth/_services/publicPayment.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-categories-edit',
  templateUrl: './categories-edit.component.html',
  styleUrls: ['./categories-edit.component.scss']
})
export class CategoriesEditComponent implements OnInit {

  
  errorMessage;
  categoryForm: FormGroup;
  category
  constructor(
    public dialogRef: MatDialogRef<CategoriesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private publicPaymentService: publicPaymentService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    if (this.data!='') {
      this.category = this.data.categoryName
    } else {
      this.category = ''
    }

    this.createForm()
  }
  onNoClick() {
    this.dialogRef.close();
  }

  createForm() {

    this.categoryForm = this.fb.group({
      categoryName: [this.category, Validators.required],


    });
  }

  updateCategoryName() {

    const controls = this.categoryForm.controls;
    /** check form */
    if (this.categoryForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.errorMessage = 'Please check invalid fields'
      return;
    }
    if (this.data!='') {
      let categoryObject={
        "employeeID":JSON.parse(localStorage.getItem('currentUser')).employeeID,
        "categoryName":this.categoryForm.controls['categoryName'].value
      }
      this.publicPaymentService.updateCategory(this.data.categoryID, categoryObject).subscribe(res => {
        if (res.result == true) {
          this.dialogRef.close({ res })
        } else {
          this.errorMessage = res.message;
        }

      })
    } else {
      let categoryObject={
        "employeeID":JSON.parse(localStorage.getItem('currentUser')).employeeID,
        "categoryName":this.categoryForm.controls['categoryName'].value
      }
      this.publicPaymentService.addNewCategory(categoryObject).subscribe(res => {
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

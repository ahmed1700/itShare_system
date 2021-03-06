import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'kt-alert-component',
  templateUrl: './alert-component.component.html',
  styleUrls: ['./alert-component.component.scss']
})
export class AlertComponentComponent implements OnInit {

  
  viewLoading: boolean = false;
  title;
  message;
 loading=false
  constructor(
    public dialogRef: MatDialogRef<AlertComponentComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
  ) { }
 
  ngOnInit() { 
    this.dialogRef.disableClose = true;
    this.title=this.data.title;
    this.message=this.data.message;
  }

  onNoClick(): void {
		this.dialogRef.close();
	}

	/**
	 * Close dialog with true result
	 */
	onYesClick(): void {
    /* Server loading imitation. Remove this */
    this.loading=true
		this.viewLoading = true;
		this.dialogRef.close(true); // Keep only this row
	}
 

}

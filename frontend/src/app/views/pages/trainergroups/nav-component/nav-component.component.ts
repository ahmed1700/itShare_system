import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import {  MatDialog } from '@angular/material';
import { TrainerPaymentComponent } from '../trainer-payment/trainer-payment.component';
import { ChangePassComponent } from '../change-pass/change-pass.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';
@Component({
  selector: 'kt-nav-component',
  templateUrl: './nav-component.component.html',
  styleUrls: ['./nav-component.component.scss']
})
export class NavComponentComponent implements OnInit {
 trainerName :string= JSON.parse(localStorage.getItem('currentTrainer')).fullNameEnglish;
 trainerID: number= JSON.parse(localStorage.getItem('currentTrainer')).trainerID;
  constructor(private router: Router,
    public dialog: MatDialog,
	private layoutUtilsService: LayoutUtilsService,
	private activatedRoute:ActivatedRoute,
    ) { }

  ngOnInit() {
  }

  logOut() {
		localStorage.clear();
		this.router.navigate(['/auth/trainerlogin'])
  }
  
  showPayment() {
		const dialogRef = this.dialog.open(TrainerPaymentComponent, {
			data: this.trainerID,
			width: '800px',

    });
    

  }

  showCalender(){
	this.router.navigate(['calender'], { relativeTo: this.activatedRoute });
  }
  
  changePassword() {
		const dialogRef = this.dialog.open(ChangePassComponent, {
			data: this.trainerID,
			width: '800px',

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification('Password Changed Succefully');

		})
	}

}

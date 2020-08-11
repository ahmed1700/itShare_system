import { Component, OnInit } from '@angular/core';
import { publicPaymentService } from '../../../../core/auth/_services/publicPayment.service';
//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Branch } from '../../../../core/auth/_models/branches.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { PaymentPdfComponent } from '../payment-pdf/payment-pdf.component';

@Component({
  selector: 'kt-find-payment',
  templateUrl: './find-payment.component.html',
  styleUrls: ['./find-payment.component.scss']
})
export class FindPaymentComponent implements OnInit {
  selectedBranch = 0
  end_date;
  start_date;
  filterParams = {}
  allBranches: Branch[];
  private subscriptions: Subscription[] = [];
  filterPublicPayment;
  
  constructor(private publicPaymentService: publicPaymentService, private branchesService: branchesService,public dialog: MatDialog, ) { }

  ngOnInit() {
    this.getAllBranches()
    this.end_date = this.start_date = new Date() 
  }
  findPayment() {
    if(this.selectedBranch!=0){
      this.filterParams['branchID']=this.selectedBranch
    }
    if(this.end_date&&this.end_date!=null&&this.start_date&&this.start_date!=null){
      this.filterParams['start_date']=this.start_date
      this.filterParams['end_date']=this.end_date
    }
    if((this.start_date&&this.start_date!=null&&!this.end_date&&this.end_date==null)||(this.end_date&&this.end_date!=null&&!this.start_date&&this.start_date==null)){
      if(this.end_date==null){
        this.end_date=this.start_date
      }else{
        this.start_date=this.end_date
      }
      this.filterParams['start_date']=this.start_date
      this.filterParams['end_date']=this.end_date
     
    }
  let payment= this.publicPaymentService.getAllPayment(this.filterParams).subscribe(res=>{
      if(res.result==true){
        this.filterPublicPayment=res.data
        const dialogRef=  this.dialog.open( PaymentPdfComponent, { data: {PublicPayment:this.filterPublicPayment ,'start_date':this.start_date,'end_date':this.end_date,'branch':this.selectedBranch,'branches':this.allBranches,}, height: '500px',
        width: '500px',}); 
      }
      
    })
    this.subscriptions.push(payment)
  }


  getAllBranches() {
    let branches = this.branchesService.getBranches().subscribe(res => {
      if (res.result == true) {
        this.allBranches = res.data;
      }
    })
    this.subscriptions.push(branches)
  }

}

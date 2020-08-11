import { Component, OnInit,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { Branch } from '../../../../core/auth/_models/branches.model';
@Component({
  selector: 'kt-payment-pdf',
  templateUrl: './payment-pdf.component.html',
  styleUrls: ['./payment-pdf.component.scss']
})
export class PaymentPdfComponent implements OnInit {
  allPublicPayments=[]
  noPublicPayment
  allBranches: Branch[];
  start_day;
  end_date;
  branch

  constructor(
    public dialogRef: MatDialogRef<PaymentPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.allPublicPayments=this.data.PublicPayment;
    this.start_day=this.data.start_date;
    if(this.data.end_date){
      this.end_date=this.data.end_date
    }
    if(this.data.branch){
      this.branch=this.data.branch
    }

    this.allBranches=this.data.branches;
  }
  getBranchName(id){
    if (this.allBranches) {
      if (this.allBranches.length > 0) {
        const branches = this.allBranches.find(branch => branch.branchID === id)
        return branches.name
      }
    }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('billingFile').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>ITShare Invoice</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          <style>
          body {
            margin-top: 30px;
            margin-bottom: 30px;
        }
        .header-container{
          display: flex;
          justify-content: center;
          align-items:baseline;
      }
        
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}

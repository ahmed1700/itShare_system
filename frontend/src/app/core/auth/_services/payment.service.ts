import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Payment} from '../_models/payment.model'
// Environment
import { CreateURL } from '../Public_Url'
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  PaymentsURL=_url('payments');
  RefundUrl=_url('refund');
  errorMessage ='';
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
  constructor(private http: HttpClient) { }


  getPayments():Observable<any> {
    return this.http.get<any>(`${this.PaymentsURL}`)
  } 

  getPaymentByID(PaymentID:number):Observable<any>{
   return this.http.get<any>(`${this.PaymentsURL}/${PaymentID}`, { headers: this.headers })
  }

  addNewPayment(Payment:Payment):Observable<any>{
   return this.http.post<any>(`${this.PaymentsURL}`, Payment)
  }


  getExamPaymentForEmployee(branchID,date):Observable<any>{
    return this.http.post<any>(`${this.PaymentsURL}/employeePayment`, {branchID:branchID,date:date})
  }
  findRemaining(PaymentID):Observable<any>{
    return this.http.post<any>(`${this.PaymentsURL}/in/${PaymentID}`, { headers: this.headers })
  }
  getStudentAllPayment(studentID:number):Observable<any>{
    return this.http.get<any>(`${this.PaymentsURL}/all/${studentID}`, { headers: this.headers })
  }

  getPaymentDetails(studentID):Observable<any>{
    return this.http.post<any>(`${this.PaymentsURL}/studentPayment/${studentID}`, { headers: this.headers })
  }

  managerRefund(Payment:Payment):Observable<any>{
    return this.http.post<any>(`${this.RefundUrl}`, Payment)
   
  }

  getRefunds():Observable<any>{
    return this.http.get<any>(`${this.RefundUrl}`)
   
  }

  editRefund(id,status):Observable<any>{
    return this.http.put<any>(`${this.RefundUrl}/${id}`,{'status':status})
  }
    
}

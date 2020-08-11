import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

// Environment
import { CreateURL } from '../Public_Url'


const _url = CreateURL.createURL;

@Injectable({
  providedIn: 'root'
})
 
export class publicPaymentService {
  publicPaymentURL=_url('publicPayment');
  categoriesURL=_url('categories');
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');

  constructor(private http: HttpClient) { }

  getPublicPayment():Observable<any> {
    return this.http.get<any>(`${this.publicPaymentURL}`)
  } 

  getPublicPaymentByID(publicPaymentID:number):Observable<any>{
   return this.http.get<any>(`${this.publicPaymentURL}/${publicPaymentID}`, { headers: this.headers })
  }

  addNewpublicPayment(publicPayment):Observable<any>{
   return this.http.post<any>(`${this.publicPaymentURL}`, publicPayment)
  }

  getPublicPaymentForEmployee(branchID,date):Observable<any>{
    return this.http.post<any>(`${this.publicPaymentURL}/employeePayment`, {branchID:branchID,date:date})
  }
 


  updatePublicPayment(publicPaymentID:number,publicPayment):Observable<any>{
   return this.http.put<any>(`${this.publicPaymentURL}/${publicPaymentID}`, publicPayment ,{ headers: this.headers })
  }

  getAllCategory():Observable<any> {
    return this.http.get<any>(`${this.categoriesURL}`)
  } 
    // get categories id and name only
  getAllCategoryName():Observable<any> {
    return this.http.get<any>(`${this.categoriesURL}/categoriesName`)
  } 

  getCategoryByID(CategoryID:number):Observable<any>{
   return this.http.get<any>(`${this.categoriesURL}/${CategoryID}`, { headers: this.headers })
  }

  addNewCategory(Category):Observable<any>{
   return this.http.post<any>(`${this.categoriesURL}`, Category)
  }

  updateCategory(CategoryID:number,Category):Observable<any>{
   return this.http.put<any>(`${this.categoriesURL}/${CategoryID}`, Category ,{ headers: this.headers })
  }



  getAllPayment(filterParams):Observable<any>{
    return this.http.post<any>(`${this.publicPaymentURL}/allpayments`, filterParams)
   }


}

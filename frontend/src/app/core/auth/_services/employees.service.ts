import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Employee} from '../_models/employees.model'
// Environment
import { CreateURL } from '../Public_Url'
const _url = CreateURL.createURL;

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  employeesURL=_url('employees');
  loanUrl=_url('loans');
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
  constructor(private http: HttpClient) { }

  getemployees():Observable<any> {
    return this.http.get<any>(`${this.employeesURL}`)
  } 

  getemployeeByID(employeeID:number):Observable<any>{
   return this.http.get<any>(`${this.employeesURL}/${employeeID}`, { headers: this.headers })
  }

  addNewemployee(employee:Employee):Observable<any>{
   return this.http.post<any>(`${this.employeesURL}`, employee)
  }

  updateemployee(employeeID:number,employee:Employee):Observable<any>{
   return this.http.put<any>(`${this.employeesURL}/${employeeID}`, employee ,{ headers: this.headers })
  }

  changePassword(employeeID:number,passord):Observable<any>{
    return this.http.put<any>(`${this.employeesURL}/changepassword/${employeeID}` ,{'password':passord},{ headers: this.headers })
   }

   
  makeLoan(loan):Observable<any>{
    return this.http.post<any>(`${this.loanUrl}` ,loan,{ headers: this.headers })
   }

   filterLoanByMonth(month):Observable<any>{
    return this.http.post<any>(`${this.loanUrl}/findByMonth` ,{month:month},{ headers: this.headers })
   }
  
  

}

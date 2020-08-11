import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

// Environment
import { CreateURL } from '../Public_Url'


const _url = CreateURL.createURL;

@Injectable({
  providedIn: 'root'
})

export class examsService {
  ExamsURL=_url('exams');
  AssignExamsURL=_url('studentExam');
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');

  constructor(private http: HttpClient) { }

  getExams():Observable<any> {
    return this.http.get<any>(`${this.ExamsURL}`)
  } 

  getExamByID(examID:number):Observable<any>{
   return this.http.get<any>(`${this.ExamsURL}/${examID}`, { headers: this.headers })
  }

  addNewExam(exam):Observable<any>{
   return this.http.post<any>(`${this.ExamsURL}`, exam)
  }

  updateExam(examID:number,exam):Observable<any>{
   return this.http.put<any>(`${this.ExamsURL}/${examID}`, exam ,{ headers: this.headers })
  }

  getAssignExams():Observable<any> {
    return this.http.get<any>(`${this.AssignExamsURL}`)
  } 

  getPaymentForEmployee(branchID,date):Observable<any>{
    return this.http.post<any>(`${this.AssignExamsURL}/employeePayment`, {branchID:branchID,date:date})
  }

  getAssignExamByID(examID:number):Observable<any>{
   return this.http.get<any>(`${this.AssignExamsURL}/${examID}`, { headers: this.headers })
  }

  addNewAssignExam(exam):Observable<any>{
   return this.http.post<any>(`${this.AssignExamsURL}`, exam)
  }

  addStudentAssignExam(studentID):Observable<any>{
    return this.http.post<any>(`${this.AssignExamsURL}/assign`, {'studentID':studentID})
   }

  updateAssignExam(examID:number,exam):Observable<any>{
   return this.http.put<any>(`${this.AssignExamsURL}/${examID}`, exam ,{ headers: this.headers })
  }


}

import { Injectable } from '@angular/core';
import {HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Student} from '../_models/students.model'
// Environment
import { CreateURL } from '../Public_Url'


const _url = CreateURL.createURL;


@Injectable({
    providedIn: 'root'
})

//getbilldetails
export class StudentService {
     studentsURL=_url('students');
     termsURL=_url('terms');
     errorMessage ='';
     headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
    constructor(private http: HttpClient) { }
   
   getStudents():Observable<any> {
     return this.http.get(`${this.studentsURL}`)
   } 

   getStudentByID(studentID):Observable<any>{
    return this.http.get(`${this.studentsURL}/${studentID}`, { headers: this.headers })
   }

   addNewStudent(student:Student):Observable<any>{
    return this.http.post<any>(`${this.studentsURL}`, student)
   }

   updateStudent(studentID,student:Student):Observable<any>{
      let url= `${this.studentsURL}/${studentID}`
     return this.http.put<any>(url, student,{ headers: this.headers })
   }


   getTerms():Observable<any> {
    return this.http.get(`${this.termsURL}`)
  } 

  getTermsByID(termID):Observable<any>{
   return this.http.get(`${this.termsURL}/${termID}`, { headers: this.headers })
  }

  addNewTerms(term):Observable<any>{
   return this.http.post<any>(`${this.termsURL}`, {'Terms':term})
  }

  updateTerms(termID,term):Observable<any>{
     let url= `${this.termsURL}/${termID}`
    return this.http.put<any>(url, {'Terms':term},{ headers: this.headers })
  }


   
   
    
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignStudent } from '../_models/assignStudent.model'
// Environment
import { CreateURL } from '../Public_Url'


const _url = CreateURL.createURL;


@Injectable({
  providedIn: 'root'
})


//getbilldetails
export class AssignStudentService {
  studentsURL = _url('assignStudent');
  studentAttendUrl= _url('studentAttend');
  errorMessage = '';
  headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }


  getAssignStudentByID(studentID): Observable<any> {
    return this.http.get(`${this.studentsURL}/${studentID}`, { headers: this.headers })
  }

  getStudentAttendByID(id): Observable<any> {
    return this.http.get(`${this.studentAttendUrl}/${id}`, { headers: this.headers })
  }

  assignNewStudent(student: AssignStudent): Observable<any> {
    return this.http.post(`${this.studentsURL}`, student)
  }

  updateStudent(studentID, student: AssignStudent): Observable<any> {
    let url = `${this.studentsURL}/${studentID}`
    return this.http.put<any>(url, student, { headers: this.headers })
  }

  removeStudentFromGroup(studentID): Observable<any> {
    let url = `${this.studentsURL}/removeGroup/${studentID}`
    return this.http.put<any>(url, { headers: this.headers })
  }


  getAssinStudent(studentID): Observable<any> {
    return this.http.post(`${this.studentsURL}/assign`, { "studentID": studentID })
  }

  getAllAssignedStudents(): Observable<any> {
    return this.http.get<any>(`${this.studentsURL}`)
  }







}
import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../_models/Courses.model'
// Environment
import { CreateURL } from '../Public_Url'


const _url = CreateURL.createURL;

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  CoursesURL=_url('courses');
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');

  constructor(private http: HttpClient) { }

  getCourses():Observable<any> {
    return this.http.get<any>(`${this.CoursesURL}`)
  } 

  getCoursesName():Observable<any> {
    return this.http.get<any>(`${this.CoursesURL}/coursesName`)
  } 

  getCourseByID(courceID:number):Observable<any>{
   return this.http.get<any>(`${this.CoursesURL}/${courceID}`, { headers: this.headers })
  }

  getCourseTracks(courceID:number):Observable<any>{
    return this.http.get<any>(`${this.CoursesURL}/courseTracks/${courceID}`, { headers: this.headers })
   }
  
  addNewCourse(cource:Course):Observable<any>{
    console.log(cource);
   return this.http.post<any>(`${this.CoursesURL}`, cource)
  }

  getCoursesByStudent(studentID):Observable<any>{
    return this.http.post(`${this.CoursesURL}/findByStudent`,{'studentID':studentID})
  }

  updateCourse(courceID:number,course:Course):Observable<any>{
    console.log(course);
   return this.http.put<any>(`${this.CoursesURL}/${courceID}`, course ,{ headers: this.headers })
  }


}

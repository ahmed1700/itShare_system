import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {vacation} from '../_models/vacations.model'
// Environment
import { CreateURL } from '../Public_Url'


const _url = CreateURL.createURL;

@Injectable({
  providedIn: 'root'
})
export class VacationsService {
  vacationsURL=_url('vacations');
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');

  constructor(private http: HttpClient) { }

  getVacations():Observable<any> {
    return this.http.get<any>(`${this.vacationsURL}`)
  } 

  getVacationByID(vacationID):Observable<any>{
   return this.http.get<any>(`${this.vacationsURL}/${vacationID}`, { headers: this.headers })
  }

  addNewVacation(vacation:vacation):Observable<any>{
   return this.http.post<any>(`${this.vacationsURL}`, vacation)
  }

  updateVacation(vacationID:number,vacation:vacation):Observable<any>{
   return this.http.put<any>(`${this.vacationsURL}/${vacationID}`, vacation ,{ headers: this.headers })
  }

}

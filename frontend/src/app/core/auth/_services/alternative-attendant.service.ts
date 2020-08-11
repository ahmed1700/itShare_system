import { Injectable } from '@angular/core';
import {CreateURL} from '../Public_Url';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AlternativeAttendant } from '../_models/alternativeAttendant.model';
import { Observable } from 'rxjs';
const _url=CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})
export class AlternativeAttendantService {
  errorMessage='';
  alternativeAttendantUrl=_url("alternativeAttendan");
  header=new HttpHeaders().set('content-Type','application/json');
  constructor(private http:HttpClient) { }

  GetAllAlternativeAttendant():Observable<any>
  {
    return this.http.get<any>(`${this.alternativeAttendantUrl}`);
  }
  GetAlternativeAttendByID(ID:number):Observable<any>
  {
    return this.http.get<any>(`${this.alternativeAttendantUrl}/${ID}`,{headers:this.header});
  }
  
  AddAlternativeAttend(alternativeAttend:AlternativeAttendant):Observable<any>
  {
   return this.http.post<AlternativeAttendant>(`${this.alternativeAttendantUrl}`,alternativeAttend)
  }
  UpdateAlternativeAttend(alternativeAttend:AlternativeAttendant,ID:number):Observable<any>
  {
   return this.http.put<any>(`${this.alternativeAttendantUrl}/${ID}`,alternativeAttend,{headers:this.header});
  }
  getTrainerAlternativeAttendant(trainerID):Observable<any>{
    return this.http.post<AlternativeAttendant>(`${this.alternativeAttendantUrl}/trainer`,{'trainerID':trainerID})
  }
  
}

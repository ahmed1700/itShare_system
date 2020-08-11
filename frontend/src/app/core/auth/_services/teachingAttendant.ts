import { Injectable } from '@angular/core';
import { CreateURL } from '../Public_Url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { teachingAttendant } from '../_models/teachingAttendant';
import { Observable } from 'rxjs';
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})
export class TeachingAttendantService {
  errorMessage = '';
  teachingAttendantUrl = _url("teacheingAttendant");
  delayAttendantUrl = _url("delayAttendant");
  trainerPaymentUrl = _url("trainerPayment");
  studentAttendantURL = _url("studentAttend");
  header = new HttpHeaders().set('content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  GetAllTeachingAttendant(): Observable<any> {
    return this.http.get<any>(`${this.teachingAttendantUrl}`);
  }
  GetTeachingAttendByID(ID: number): Observable<any> {
    return this.http.get<any>(`${this.teachingAttendantUrl}/${ID}`, { headers: this.header });
  }

  trainerSignIn(teachingAttendant): Observable<any> {
    return this.http.post<any>(`${this.teachingAttendantUrl}`, teachingAttendant)
  }
  trainerSignOut(ID: number, ip): Observable<any> {
    return this.http.put<any>(`${this.teachingAttendantUrl}/${ID}`, { 'ip': ip }, { headers: this.header });
  }

  trainerAttendant(trainerID,groupID): Observable<any> {
    return this.http.post<any>(`${this.teachingAttendantUrl}/trainerAttendant`, { 'trainerID': trainerID ,'groupID':groupID}, { headers: this.header })
  }

  getStudentAttendant(groupID): Observable<any> {
    return this.http.post<any>(`${this.teachingAttendantUrl}/studentAttendant`,{groupID:groupID} , { headers: this.header })
  }

  postStudentAttendant(data): Observable<any> {
    return this.http.post<any>(`${this.studentAttendantURL}`,data , { headers: this.header })
  }

  delaySignOut(ID: number, ip): Observable<any> {
    return this.http.put<any>(`${this.delayAttendantUrl}/${ID}`, { 'ip': ip }, { headers: this.header });
  }

  delaySignIn(teachingAttendant): Observable<any> {
    return this.http.post<any>(`${this.delayAttendantUrl}`, teachingAttendant)
  }

  adminUpdate(ID: number, newAttend): Observable<any> {
    return this.http.put<any>(`${this.teachingAttendantUrl}/admin/${ID}`, newAttend, { headers: this.header });
  }

  getTrainerPayment(trainerID): Observable<any> {
    return this.http.post<any>(`${this.trainerPaymentUrl}/trainer`, { 'trainerID': trainerID });
  }
  getAllTrainerPayment(): Observable<any> {
    return this.http.get<any>(`${this.trainerPaymentUrl}`);
  }
  postNewTranerPayment(payment): Observable<any> {
    return this.http.post<any>(`${this.trainerPaymentUrl}`, payment);
  }

  getAttendantByAdmin(trainerID,groupID,trackID): Observable<any> {
    return this.http.post<any>(`${this.teachingAttendantUrl}/adminAttendant`, { 'trainerID': trainerID ,'groupID':groupID,'trackID':trackID });
  }


}

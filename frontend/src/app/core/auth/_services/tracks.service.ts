import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Track} from '../_models/Tracks.model'
// Environment
import { CreateURL } from '../Public_Url'


const _url = CreateURL.createURL;

@Injectable({
  
  providedIn: 'root'
})
export class TracksService {
  TracksURL=_url('tracks');
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');

  constructor(private http: HttpClient) { }

  getTracks():Observable<any> {
    return this.http.get<any>(`${this.TracksURL}`)
  } 

  getTrackByID(trackID):Observable<any>{
   return this.http.get<any>(`${this.TracksURL}/${trackID}`, { headers: this.headers })
  }

  addNewTrack(track:Track):Observable<any>{
   return this.http.post<any>(`${this.TracksURL}`, track)
  }

  updateTrack(trackID:number,track:Track):Observable<any>{
   return this.http.put<any>(`${this.TracksURL}/${trackID}`, track ,{ headers: this.headers })
  }

}

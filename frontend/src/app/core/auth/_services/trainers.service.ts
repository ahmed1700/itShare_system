import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Trainer} from '../_models/Trainers.model'
// Environment
import { CreateURL } from '../Public_Url'

const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})
export class TrainersService {
  TrainersURL=_url('trainers');
  errorMessage ='';
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
  constructor(private http: HttpClient) { }


  getTrainers():Observable<any> {
    return this.http.get<any>(`${this.TrainersURL}`)
  } 

  getTrainerByID(trainerID:number):Observable<any>{
   return this.http.get<any>(`${this.TrainersURL}/${trainerID}`, { headers: this.headers })
  }

  addNewTrainer(trainer:Trainer):Observable<any>{
   return this.http.post<any>(`${this.TrainersURL}`, trainer)
  }

  updateTrainer(trainerID:number,trainer:Trainer):Observable<any>{
   return this.http.put<any>(`${this.TrainersURL}/${trainerID}`, trainer ,{ headers: this.headers })
  }

  changePassword(trainerID:number,passord):Observable<any>{
    return this.http.put<any>(`${this.TrainersURL}/changepassword/${trainerID}` ,{'password':passord},{ headers: this.headers })
   }
  
}

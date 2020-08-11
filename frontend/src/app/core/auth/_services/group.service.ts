import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Group} from '../_models/group.model'
// Environment
import { CreateURL } from '../Public_Url'
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  GroupsURL=_url('groups');
  TranierGroupsURL=_url('groups/trainer');
  errorMessage ='';
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
  constructor(private http: HttpClient) { }


  getGroups():Observable<any> {
    return this.http.get<any>(`${this.GroupsURL}`)
  } 

  getGroupByID(GroupID:number):Observable<any>{
   return this.http.get<any>(`${this.GroupsURL}/${GroupID}`, { headers: this.headers })
  }


  getWorkingGroups():Observable<any>{
    return this.http.get<any>(`${this.GroupsURL}/workingGroups`, { headers: this.headers })
   }

   getWorkingGroupsByBranch(branchID):Observable<any>{
    return this.http.post<any>(`${this.GroupsURL}/workingGroupsByBranch`, { branchID: branchID })
   }


   getWorkingAndPendingGroups():Observable<any>{
    return this.http.get<any>(`${this.GroupsURL}/activegroups`, { headers: this.headers })
   }
 

  addNewGroup(Group:Group):Observable<any>{
   return this.http.post<any>(`${this.GroupsURL}`, Group)
  }
  getTrainerGroups(TrainerID:number):Observable<any>{
    return this.http.post<any>(`${this.TranierGroupsURL}`, {"trainerID":TrainerID})
   }

  updateGroup(GroupID:number,Group:Group):Observable<any>{
   return this.http.put<any>(`${this.GroupsURL}/${GroupID}`, Group ,{ headers: this.headers })
  }

  findGroupByCourse(courseID):Observable<any>{
    return this.http.post(`${this.GroupsURL}/findByCourse`,{'courseID':courseID})
  }

  findGroupByStudent(studentID):Observable<any>{
    return this.http.post(`${this.GroupsURL}/findByStudent`,{'studentID':studentID})
  }
   
  getTrainerPayment():Observable<any> {
    return this.http.get<any>(`${this.GroupsURL}/trainerpay`)
  } 

  getTrainerPaymentByTrainerID(trainerID):Observable<any> {
    return this.http.post<any>(`${this.GroupsURL}/trainerPayment`,{trainerID:trainerID})
  } 

  getTodaysGroupForTrainer(trainerID):Observable<any> {
    return this.http.post<any>(`${this.GroupsURL}/trainertoday`,{trainerID:trainerID})
  } 
    
}

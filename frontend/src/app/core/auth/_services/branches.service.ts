import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Branch} from '../_models/branches.model'
// Environment
import { CreateURL } from '../Public_Url'



const _url = CreateURL.createURL;


@Injectable({
    providedIn: 'root'
})


export class branchesService {
  errorMessage ='';
     branchesURL=_url('branch');
     headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
    constructor(private http: HttpClient) { }
   
   getBranches():Observable<any> {
     return this.http.get<any>(`${this.branchesURL}`)
   } 

   getBranchtByID(branchID):Observable<any>{
    return this.http.get<any>(`${this.branchesURL}/${branchID}`, { headers: this.headers })
   }

   addNewBranch(branch:Branch):Observable<any>{
    return this.http.post<any>(`${this.branchesURL}`, branch)
   }

   updateBranch(branchID,branch:Branch):Observable<any>{
    return this.http.put<any>(`${this.branchesURL}/${branchID}`, branch ,{ headers: this.headers })
   }
   

    
}
import { Injectable } from '@angular/core';
import {CreateURL} from '../Public_Url';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
const _url=CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})
export class TransferService {
  errorMessage='';
  transferUrl=_url("transfer");
  managerTransferUrl=_url("managertranfer");
  header=new HttpHeaders().set('content-Type','application/json');
  constructor(private http:HttpClient) { }


  postNewTansfer(transfer):Observable<any>
  {
   return this.http.post<any>(`${this.transferUrl}`,transfer)
  }
  getStudentTansfer(ID:number):Observable<any> 
  {
   return this.http.get<any>(`${this.transferUrl}/${ID}`,{headers:this.header});
  }

  ManagerPostNewTansfer(transfer):Observable<any>
  {
   return this.http.post<any>(`${this.managerTransferUrl}`,transfer)
  }
  adminTransferPermision(id,status):Observable<any>
  {
   return this.http.put<any>(`${this.managerTransferUrl}/${id}`,{'status':status},{headers:this.header});
  }

  transferPermissionRequest():Observable<any>
  {
   return this.http.get<any>(`${this.managerTransferUrl}`)
  }
  
}

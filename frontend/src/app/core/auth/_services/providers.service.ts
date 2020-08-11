import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {provider} from '../_models/providers.models';
// Environment
import { CreateURL } from '../Public_Url';
const _url = CreateURL.createURL;

@Injectable({
  providedIn: 'root'
})

export class ProvidersService {

  providersURL=_url('providers');
  headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
 
  constructor(private http: HttpClient) { }

 getProviders():Observable<any> {
  return this.http.get<any>(`${this.providersURL}`)
 }
 getProviderByID(providerID):Observable<any>{
  return this.http.get<any>(`${this.providersURL}/${providerID}`)
 }

 addNewProvider(provider:provider):Observable<any>{
  return this.http.post<any>(`${this.providersURL}`,provider);
 }

 updateProvider(ProviderID,provider:provider):Observable<any>{
  
  return this.http.put<any>(`${this.providersURL}/${ProviderID}`, provider ,{ headers: this.headers })
 }


}

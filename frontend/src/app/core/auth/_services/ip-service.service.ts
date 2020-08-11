import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {
   params = {
    mode: 'no-cors',
    redirect: "follow",
    referrer: "no-referrer"
  };
  constructor(private http:HttpClient) { }
  public getIPAddress()  
  {  
    return this.http.get("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json" );  
  } 
}

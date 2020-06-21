import { Injectable } from '@angular/core';
import { EnvironmentService } from '../env/environment.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public phone: number;
  private iss = {
    login1: this.env.backendUrl + '/api/auth/loginwithemail',
    login2: this.env.backendUrl + '/api/auth/loginwithphone',
    loginAdmin: this.env.backendUrl + '/api/auth/loginAdmin',
    signup: this.env.backendUrl + '/api/auth/signup',
    signupAdmin: this.env.backendUrl + '/api/auth/signupAdmin'
  }

  public errorMessage: string = '';

  constructor(private env: EnvironmentService) { }


handle(data){
  this.set( data );
}

set(token){
  localStorage.setItem('token', token)
}
  

get(){
  return localStorage.getItem('token');
}

remove(){
  localStorage.removeItem('token');
}

isValid(){
  const token = this.get();
  if(token){
    const payload = this.payload( token )
    if ( payload ) { 
      this.phone = payload.phone;
     return  Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false; 
    }
    return false;
  }
}
  
  isAdmin(){
  const token = this.get();
  if(token){
    const payload = this.payload( token )
    if ( payload ) {
      return  (payload.role == 'Admin') ? true : false; 
    }
      return false;
    }
  }
  
  isCollector(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.role == 'Collector') ? true : false; 
      }
        return false;
     }
  }
  
  
  isVendor(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.role == 'Vendor') ? true : false; 
      }
        return false;
    }
  }
  
  isEnterprise(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.role == 'Enterprise') ? true : false; 
      }
        return false;
    }
  }
  
  isHousehold(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.role == 'Household') ? true : false; 
      }
        return false;
    }
}

payload(token){
  const payload = token.split('.')[1];
  return this.decode(payload);
}

decode(payload){
  return JSON.parse(atob(payload));
}

loggedIn(){
  return this.isValid();
}
  
  Admin() {
    return this.isAdmin();
  }

  
  Vendor() {
    return this.isVendor();
  }

  Enterprise() {
    return this.isEnterprise();
  }
  
  Household() {
    return this.isHousehold();
  }

  Collector() {
    return this.isCollector();
  }

}

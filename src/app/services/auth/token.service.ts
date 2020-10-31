import { Injectable } from '@angular/core';
import { EnvironmentService } from '../env/environment.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public _id: String;
  private iss = {
    login1: this.env.backendUrl + '/loginwithemail',
    login2: this.env.backendUrl + '/loginwithphone',
    loginAdmin: this.env.backendUrl + '/loginAdmin',
    registerEnterprise: this.env.backendUrl + '/registerEnterprise',
    registerHousehold: this.env.backendUrl + '/registerHousehold',
    registerCollector: this.env.backendUrl + '/registerCollector',
    registerHost: this.env.backendUrl + '/registerHost',
    registerAgent: this.env.backendUrl + '/registerAgent',
    signupAdmin: this.env.backendUrl + '/signupAdmin'
  }

  public errorMessage: string = '';

  constructor(private env: EnvironmentService) { }


handle(token){
  this.set( token );
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

isValid() {
  const helper = new JwtHelperService();
  let token = this.get();
  if(token){
    const payload = this.payload( token )
    if ( payload ) { 
      this._id = payload.id;
      return !helper.isTokenExpired( token );
    }
    return false;
  }
}
  
  isAdmin(){
  const token = this.get();
  if(token){
    const payload = this.payload( token )
    if ( payload ) {
      return  (payload.userable_type == 'Admin') ? true : false; 
    }
      return false;
    }
  }
  
  isCollector(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.userable_type == 'Collector') ? true : false; 
      }
        return false;
     }
  }
  
  
  isHost(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.userable_type == 'Host') ? true : false; 
      }
        return false;
    }
  }
  
  isEnterprise(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.userable_type == 'Enterprise') ? true : false; 
      }
        return false;
    }
  }
  
  isHousehold(){
    const token = this.get();
    if(token){
      const payload = this.payload( token )
      if ( payload ) {
        return  (payload.userable_type == 'Household') ? true : false; 
      }
        return false;
    }
}

payload(token){
  const payload = token.split( '.' )[ 1 ];
  return this.decode(payload);
}

  decode( payload ) {
  return JSON.parse(atob(payload));
}

loggedIn(){
  return this.isValid();
}
  
Admin() {
  return this.isAdmin();
}


Host() {
  return this.isHost();
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

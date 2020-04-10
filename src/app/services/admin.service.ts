import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {  

  ADMIN_URL: string = this.env.backendUrl + "/api/auth"; 

  constructor ( private http: HttpClient, private Token: TokenService, private env: EnvironmentService ) { }
  
  login(formData) {
    return this.http.post(`${this.ADMIN_URL}/loginAdmin`, formData);
  }

  register(formData) {
    return this.http.post(`${this.ADMIN_URL}/signupAdmin`, formData);
  }

  sendPasswordResetLink(formData){
    return this.http.post(`${this.ADMIN_URL}/sendPasswordResetLink`, formData);
  }

  changePassword(formData){
    return this.http.post(`${this.ADMIN_URL}/resetPassword`, formData);
  }

  getAllUsers() {
    return this.http.get( `${ this.ADMIN_URL }/getAllUsers` );
  }

  getAllAdmins() {
    return this.http.get( `${ this.ADMIN_URL }/getAllAdmins` );
  }
}

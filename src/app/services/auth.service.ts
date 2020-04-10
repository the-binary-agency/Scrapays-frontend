import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: Subject<boolean> = new BehaviorSubject<boolean>( this.token.loggedIn() );
  private Admin: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Admin() );
  private Producer: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Producer() );
  private Vendor: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Vendor() );
  private Collector: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Collector() );
  authStatus = this.loggedIn.asObservable();
  adminStatus = this.Admin.asObservable();
  producerStatus = this.Producer.asObservable();
  vendorStatus = this.Vendor.asObservable();
  collectorStatus = this.Collector.asObservable();

URL = this.env.backendUrl + '/api/auth'
  
  constructor ( private http: HttpClient, private token: TokenService, private env: EnvironmentService ) { }
  
  loginWithEmail( Form ) {
    return this.http.post( `${ this.URL }/loginwithemail`, Form );
  }

  loginWithPhone( Form ) {
    return this.http.post( `${ this.URL }/loginwithphone`, Form );
  }
  
  register( Form ) {
    return this.http.post( `${ this.URL }/signup`, Form );
}

  changeAuthStatus(value: boolean) {
    this.loggedIn.next( value );
  }
  
  changeAdminStatus(value: boolean) {
    this.Admin.next( value );
  }
  
  changeProducerStatus(value: boolean) {
    this.Producer.next( value );
  }
  
  changeVendorStatus(value: boolean) {
    this.Vendor.next( value );
  }
  
  changeCollectorStatus(value: boolean) {
    this.Collector.next( value );
  }
  
  getAllUsers() {
    return this.http.get( `${ this.URL }/getAllUsers` );
  }

  getAllAdmins() {
    return this.http.get( `${ this.URL }/getAllAdmins` );
  }

  getUserWithID( payload ) {
    return this.http.post( `${ this.URL }/getUserWithID`, payload );
  }

  getUserWithToken( token ) {
    return this.http.post( `${ this.URL }/getUserWithToken`, token );
  }

  getCollectorWithToken( token ) {
    return this.http.post( `${ this.URL }/getCollectorWithToken`, token );
  }

  getProducerWithToken( token ) {
    return this.http.post( `${ this.URL }/getProducerWithToken`, token );
  }

  getVendorWithToken( token ) {
    return this.http.post( `${ this.URL }/getVendorWithToken`, token );
  }

  getDisposedTonnage( id ): Observable<any> {
    return this.http.post<any>( `${ this.URL }/getDisposedTonnage`, id );
  }

  sendPasswordResetLink( Form ) {
    return this.http.post( `${ this.URL }/sendPasswordResetLink`, Form );
  }

  changePassword( Form ) {
    return this.http.post( `${ this.URL }/resetPassword`, Form );
  }

  updateUser( Form ) {
    return this.http.post( `${ this.URL }/updateUser`, Form );
  }

  registerVendor( Form ) {
    return this.http.post( `${ this.URL }/registerVendor`, Form );
  }

  getApprovedCollectors( Form ) {
    return this.http.post( `${ this.URL }/getApprovedCollectors`, Form );
  }

  approveCollector( Form ) {
    return this.http.post( `${ this.URL }/approveCollector`, Form );
  }

}

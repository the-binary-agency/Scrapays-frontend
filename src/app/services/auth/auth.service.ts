import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { EnvironmentService } from '../env/environment.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: Subject<boolean> = new BehaviorSubject<boolean>( this.token.loggedIn() );
  private Admin: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Admin() );
  private Household: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Household() );
  private Enterprise: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Enterprise() );
  private Vendor: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Vendor() );
  private Collector: Subject<boolean> = new BehaviorSubject<boolean>( this.token.Collector() );
  authStatus = this.loggedIn.asObservable();
  adminStatus = this.Admin.asObservable();
  householdStatus = this.Household.asObservable();
  enterpriseStatus = this.Enterprise.asObservable();
  vendorStatus = this.Vendor.asObservable();
  collectorStatus = this.Collector.asObservable();

  URL = this.env.backendUrl;
  
  constructor ( private http: HttpClient, private token: TokenService, private env: EnvironmentService, private router: Router ) { }

  changeAuthStatus(value: boolean) {
    this.loggedIn.next( value );
  }
  
  changeAdminStatus(value: boolean) {
    this.Admin.next( value );
  }
  
  changeHouseholdStatus(value: boolean) {
    this.Household.next( value );
  }
  
  changeEnterpriseStatus(value: boolean) {
    this.Enterprise.next( value );
  }
  
  changeVendorStatus(value: boolean) {
    this.Vendor.next( value );
  }
  
  changeCollectorStatus(value: boolean) {
    this.Collector.next( value );
  }
  
  loginWithEmail( Form ) {
    return this.http.post( `${ this.URL }/loginwithemail`, Form );
  }

  loginWithPhone( Form ) {
    return this.http.post( `${ this.URL }/loginwithphone`, Form );
  }
  
  registerEnterprise( Form ) {
    return this.http.post( `${ this.URL }/registerEnterprise`, Form );
  }
  
  registerHousehold( Form ) {
    return this.http.post( `${ this.URL }/registerHousehold`, Form );
  }
  
  registerHost( Form ) {
    return this.http.post( `${ this.URL }/registerHost`, Form );
}

  registerCollector( Form ) {
    return this.http.post( `${ this.URL }/registerCollector`, Form );
}
  registerAgent( Form ) {
    return this.http.post( `${ this.URL }/registerAgent`, Form );
}
  
  getAllUsers(id) {
    return this.http.get( `${ this.URL }/getAllUsers/${id}` );
  }

  getAllAdmins(id) {
    return this.http.get( `${ this.URL }/getAllAdmins/${id}` );
  }

  getUserWithID( id ) {
    return this.http.get( `${ this.URL }/getUserWithID/${id}`);
  }

  getUserWithNotifications( id ) {
    return this.http.get( `${ this.URL }/getUserWithNotifications/${id}`);
  }

  getProducedTonnage( id ) {
    return this.http.get( `${ this.URL }/getUserWithID/${id}`);
  }

  getUserWithTonnage( id ) {
    return this.http.get( `${ this.URL }/getUserWithTonnage/${id}`);
  }

  getCollectorWithTonnage( id ) {
    return this.http.get( `${ this.URL }/getCollectorWithTonnage/${id}`);
  }

  getDisposedTonnage( id ): Observable<any> {
    return this.http.get<any>( `${ this.URL }/getDisposedTonnage/${id}`);
  }

  sendPasswordResetLink( Form ) {
    return this.http.post( `${ this.URL }/sendPasswordResetLink`, Form );
  }

  changePassword( Form ) {
    return this.http.post( `${ this.URL }/resetPassword`, Form );
  }

  updateUser( id, Form ) {
    return this.http.post( `${ this.URL }/updateUser/${id}`, Form );
  }

  registerVendor( Form ) {
    return this.http.post( `${ this.URL }/registerVendor`, Form );
  }

  getApprovedCollectors( id ) {
    return this.http.get( `${ this.URL }/getApprovedCollectors/${id}` );
  }

  approveCollector( Form ) {
    return this.http.post( `${ this.URL }/approveCollector`, Form );
  }

  getUserCount( id ) {
    return this.http.get( `${ this.URL }/getUserCount/${id}`);
  }

  getMaterialPrices( id ) {
    return this.http.get( `${ this.URL }/getMaterialPrices/${id}`);
  }

  editMaterialPrices( id, form ) {
    return this.http.post( `${ this.URL }/editMaterialPrices/${id}`, form);
  }

  setMaterialPrices( id, form ) {
    return this.http.post( `${ this.URL }/setMaterialPrices/${id}`, form);
  }

  requestPickup( form ) {
    return this.http.post( `${ this.URL }/requestPickup`, form);
  }

  cancelPickup( form ) {
    return this.http.post( `${ this.URL }/cancelPickup`, form);
  }

  automatePickup( form ) {
    return this.http.post( `${ this.URL }/automatePickup`, form);
  }

  unAutomatePickup( id ) {
    return this.http.post( `${ this.URL }/unAutomatePickup`, id);
  }

  submitInventory( form ) {
    return this.http.post( `${ this.URL }/submitInventory`, form);
  }

  deleteNotifications( notifications ) {
    return this.http.post( `${ this.URL }/deleteNotifications`, notifications);
  }

  toggleNotifications( notifications ) {
    return this.http.post( `${ this.URL }/toggleNotifications`, notifications);
  }
  
  getUserName( form ) {
    return this.http.post( `${ this.URL }/getUserName`, form);
  }


}
``
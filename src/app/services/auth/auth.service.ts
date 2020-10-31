import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { EnvironmentService } from '../env/environment.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.loggedIn()
  );
  private Admin: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.Admin()
  );
  private Household: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.Household()
  );
  private Enterprise: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.Enterprise()
  );
  private Host: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.Host()
  );
  private Collector: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.Collector()
  );
  authStatus = this.loggedIn.asObservable();
  adminStatus = this.Admin.asObservable();
  householdStatus = this.Household.asObservable();
  enterpriseStatus = this.Enterprise.asObservable();
  HostStatus = this.Host.asObservable();
  collectorStatus = this.Collector.asObservable();

  URL = this.env.backendUrl;

  constructor(
    private http: HttpClient,
    private token: TokenService,
    private env: EnvironmentService,
    private router: Router
  ) {}

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  changeAdminStatus(value: boolean) {
    this.Admin.next(value);
  }

  changeHouseholdStatus(value: boolean) {
    this.Household.next(value);
  }

  changeEnterpriseStatus(value: boolean) {
    this.Enterprise.next(value);
  }

  changeHostStatus(value: boolean) {
    this.Host.next(value);
  }

  changeCollectorStatus(value: boolean) {
    this.Collector.next(value);
  }

  loginWithEmail(Form: any) {
    return this.http.post(`${this.URL}/auth/email/login`, Form);
  }

  loginWithPhone(Form: any) {
    return this.http.post(`${this.URL}/auth/phone/login`, Form);
  }

  registerUser(usertype: String, Form: any) {
    return this.http.post(`${this.URL}/auth/${usertype}/register`, Form);
  }

  getLoggedInUser() {
    if (this.token.Admin()) {
      return this.http.get(`${this.URL}/auth/admins/me`);
    } else if (this.token.Enterprise()) {
      return this.http.get(`${this.URL}/auth/enterprises/me`);
    } else if (this.token.Household()) {
      return this.http.get(`${this.URL}/auth/households/me`);
    } else if (this.token.Collector()) {
      return this.http.get(`${this.URL}/auth/collectors/me`);
    } else if (this.token.Host()) {
      return this.http.get(`${this.URL}/auth/hosts/me`);
    }
  }

  getAssignedRequests(id: String, query?: String) {
    return query
      ? this.http.get(`${this.URL}/collectors/${id}/pickuprequests?${query}`)
      : this.http.get(`${this.URL}/collectors/${id}/pickuprequests`);
  }

  getAllUsers(usertype: String, query?: String) {
    return query
      ? this.http.get(`${this.URL}/${usertype}?${query}`)
      : this.http.get(`${this.URL}/${usertype}`);
  }

  getAllAdmins(id: String) {
    return this.http.get(`${this.URL}/getAllAdmins/${id}`);
  }

  getUserWithID(id: String) {
    return this.http.get(`${this.URL}/users/${id}`);
  }

  getUserDetails(id: String) {
    return this.http.get(`${this.URL}/getUserDetails/${id}`);
  }

  toggleCollectorStatus(id: String) {
    return this.http.get(`${this.URL}/collectors/${id}/togglestatus`);
  }

  deleteUser(userType: String, id: String) {
    return this.http.delete(`${this.URL}/${userType}/${id}`);
  }

  getUserWithNotifications(id: String) {
    return this.http.get(`${this.URL}/auth/users/${id}/notifications`);
  }

  getProducedTonnage(id: String) {
    return this.http.get(`${this.URL}/collectedscraps/${id}/producedtonnage`);
  }

  getCollectedTonnage(id: String) {
    return this.http.get(`${this.URL}/collectedscraps/${id}/collectedtonnage`);
  }

  sendPasswordResetLink(Form: any) {
    return this.http.post(`${this.URL}/sendPasswordResetLink`, Form);
  }

  changePassword(Form: any) {
    return this.http.post(`${this.URL}/resetPassword`, Form);
  }

  updateUser(userType: String, id: String, Form: any) {
    return this.http.post(
      `${this.URL}/auth/${userType}/${id}?_method=PUT`,
      Form
    );
  }

  getApprovedCollectors(id: String) {
    return this.http.get(`${this.URL}/hosts/${id}approvedcollectors`);
  }

  approveCollector(Form: any) {
    return this.http.post(`${this.URL}/approveCollector`, Form);
  }

  getUserCount() {
    return this.http.get(`${this.URL}/users/count`);
  }

  getMaterialPrices(query?: String) {
    return query
      ? this.http.get(`${this.URL}/materials?${query}`)
      : this.http.get(`${this.URL}/materials?per_page=5`);
  }

  editMaterialPrices(id: String, form: any) {
    return this.http.post(`${this.URL}/materials/${id}?_method=PUT`, form);
  }

  deleteMaterialPrices(id: String) {
    return this.http.delete(`${this.URL}/materials/${id}`);
  }

  setMaterialPrices(form: any) {
    return this.http.post(`${this.URL}/materials/`, form);
  }

  requestPickup(form: any) {
    return this.http.post(`${this.URL}/pickuprequests`, form);
  }

  cancelPickup(id: String) {
    return this.http.get(`${this.URL}/pickuprequests/${id}/cancel`);
  }

  automatePickup(id: String) {
    return this.http.get(`${this.URL}/auth/enterprises/pickup/${id}/automate`);
  }

  unAutomatePickup(id: String) {
    return this.http.get(
      `${this.URL}/auth/enterprises/pickup/${id}/unautomate`
    );
  }

  getAllPickupRequests(query?) {
    return query
      ? this.http.get(`${this.URL}/pickuprequests?${query}`)
      : this.http.get(`${this.URL}/pickuprequests`);
  }

  getPickupRequestCounts(query?: String) {
    return query
      ? this.http.get(`${this.URL}/pickuprequests/count?${query}`)
      : this.http.get(`${this.URL}/pickuprequests/count`);
  }

  getCollectorDetails(id: String, query?) {
    return query
      ? this.http.get(`${this.URL}/collectors/${id}/details?${query}`)
      : this.http.get(`${this.URL}/collectors/${id}/details`);
  }

  assignToCollector(form: any) {
    return this.http.put(`${this.URL}/pickuprequests/assign`, form);
  }

  submitInventory(form: any) {
    return this.http.post(`${this.URL}/inventories`, form);
  }

  deleteNotifications(notifications) {
    return this.http.post(`${this.URL}/deleteNotifications`, notifications);
  }

  toggleNotifications(notifications) {
    return this.http.post(`${this.URL}/toggleNotifications`, notifications);
  }

  getUserName(phone) {
    return this.http.get(`${this.URL}/users/${phone}/name`);
  }

  pingServerWithLocation(location) {
    return this.http.post(`${this.URL}/locations/ping`, location);
  }

  getCollectorCollections(phone) {
    return this.http.get(`${this.URL}/getCollectorCollections/${phone}`);
  }

  getProducedScrap(userType: String, id: String, query?: String) {
    return query
      ? this.http.get(`${this.URL}/${userType}/${id}/producedscraps`)
      : this.http.get(`${this.URL}/${userType}/${id}/producedscraps?${query}`);
  }

  getCollectedScrap(id: String, query?: String) {
    return query
      ? this.http.get(`${this.URL}/collectors/${id}/collectedscraps?${query}`)
      : this.http.get(`${this.URL}/collectors/${id}/collectedscraps`);
  }

  getAddressWithCoordinates(loc) {
    return this.http.get(`${this.URL}/locations/address?${loc}`);
  }

  getCollectionsHistory(users = '') {
    return this.http.get(`${this.URL}/getCollectionsHistory${users}`);
  }

  getCollectionsHistoryWithQuery(phone, query = '') {
    return this.http.get(
      `${this.URL}/getCollectionsHistoryWithQuery/${phone}${query}`
    );
  }
  getSingleUserCollectionHistory(id: String, query?: String) {
    return query
      ? this.http.get(`${this.URL}/collectedscraps/${id}/history?${query}`)
      : this.http.get(`${this.URL}/collectedscraps/${id}/history`);
  }

  getCollectorCollectionsHistory(query?: String) {
    return query
      ? this.http.get(`${this.URL}/collectedscraps/history?${query}`)
      : this.http.get(`${this.URL}/collectedscraps/history`);
  }

  getScrapHistory(id: String) {
    return this.http.get(`${this.URL}/collectedscraps/${id}/history`);
  }

  getSingleScrap(id: String) {
    return this.http.get(`${this.URL}/getSingleScrap/${id}`);
  }

  getAllContactMessages(query?: String) {
    return query
      ? this.http.get(`${this.URL}/contactmessages`)
      : this.http.get(`${this.URL}/contactmessages?${query}`);
  }

  replyContactMessage(form: any, id: String) {
    return this.http.post(`${this.URL}/contactmessages/${id}/reply`, form);
  }

  deleteContactMessage(id: String) {
    return this.http.delete(`${this.URL}/contactmessages/${id}`);
  }

  getwalletbalance(id: String) {
    return this.http.get(`${this.URL}/wallets/${id}/balance`);
  }

  getPaginationResult(url) {
    return this.http.get(url);
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { TokenService } from "./token.service";
import { EnvironmentService } from "../env/environment.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
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
  private Vendor: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.Vendor()
  );
  private Collector: Subject<boolean> = new BehaviorSubject<boolean>(
    this.token.Collector()
  );
  authStatus = this.loggedIn.asObservable();
  adminStatus = this.Admin.asObservable();
  householdStatus = this.Household.asObservable();
  enterpriseStatus = this.Enterprise.asObservable();
  vendorStatus = this.Vendor.asObservable();
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

  changeVendorStatus(value: boolean) {
    this.Vendor.next(value);
  }

  changeCollectorStatus(value: boolean) {
    this.Collector.next(value);
  }

  loginWithEmail(Form) {
    return this.http.post(`${this.URL}/loginwithemail`, Form);
  }

  loginWithPhone(Form) {
    return this.http.post(`${this.URL}/loginwithphone`, Form);
  }

  registerEnterprise(Form) {
    return this.http.post(`${this.URL}/registerEnterprise`, Form);
  }

  registerHousehold(Form) {
    return this.http.post(`${this.URL}/registerHousehold`, Form);
  }

  registerHost(Form) {
    return this.http.post(`${this.URL}/registerHost`, Form);
  }

  registerCollector(Form) {
    return this.http.post(`${this.URL}/registerCollector`, Form);
  }
  registerAgent(Form) {
    return this.http.post(`${this.URL}/registerAgent`, Form);
  }

  makeAdmin(Form) {
    return this.http.post(`${this.URL}/registerAdmin`, Form);
  }

  getAssignedRequests(id) {
    return this.http.get(`${this.URL}/getAssignedRequests/${id}`);
  }

  getAllUsers(form) {
    return this.http.post(`${this.URL}/getAllUsers`, form);
  }

  getAllAdmins(id) {
    return this.http.get(`${this.URL}/getAllAdmins/${id}`);
  }

  getUserWithID(form) {
    return this.http.post(`${this.URL}/getUserWithID`, form);
  }

  getUserDetails(id) {
    return this.http.get(`${this.URL}/getUserDetails/${id}`);
  }

  toggleCollectorStatus(form) {
    return this.http.post(`${this.URL}/toggleCollectorStatus`, form);
  }

  deleteUser(form) {
    return this.http.post(`${this.URL}/deleteUser`, form);
  }

  getUserWithNotifications(id) {
    return this.http.get(`${this.URL}/getUserWithNotifications/${id}`);
  }

  getProducedTonnage(id) {
    return this.http.get(`${this.URL}/getUserWithID/${id}`);
  }

  getUserWithTonnage(id) {
    return this.http.get(`${this.URL}/getUserWithTonnage/${id}`);
  }

  getCollectorWithTonnage(id) {
    return this.http.get(`${this.URL}/getCollectorWithTonnage/${id}`);
  }

  getDisposedTonnage(id): Observable<any> {
    return this.http.get<any>(`${this.URL}/getDisposedTonnage/${id}`);
  }

  sendPasswordResetLink(Form) {
    return this.http.post(`${this.URL}/sendPasswordResetLink`, Form);
  }

  changePassword(Form) {
    return this.http.post(`${this.URL}/resetPassword`, Form);
  }

  updateUser(id, Form) {
    return this.http.post(`${this.URL}/updateUser/${id}`, Form);
  }

  registerVendor(Form) {
    return this.http.post(`${this.URL}/registerVendor`, Form);
  }

  getApprovedCollectors(id) {
    return this.http.get(`${this.URL}/getApprovedCollectors/${id}`);
  }

  approveCollector(Form) {
    return this.http.post(`${this.URL}/approveCollector`, Form);
  }

  getUserCount(id) {
    return this.http.get(`${this.URL}/getUserCount/${id}`);
  }

  getMaterialPrices(id) {
    return this.http.get(`${this.URL}/getMaterialPrices/${id}`);
  }

  editMaterialPrices(id, form) {
    return this.http.post(`${this.URL}/editMaterialPrices/${id}`, form);
  }

  deleteMaterialPrices(id, form) {
    return this.http.post(`${this.URL}/deleteMaterialPrices/${id}`, form);
  }

  setMaterialPrices(id, form) {
    return this.http.post(`${this.URL}/setMaterialPrices/${id}`, form);
  }

  requestPickup(form) {
    return this.http.post(`${this.URL}/requestPickup`, form);
  }

  cancelPickup(form) {
    return this.http.post(`${this.URL}/cancelPickup`, form);
  }

  automatePickup(form) {
    return this.http.post(`${this.URL}/automatePickup`, form);
  }

  unAutomatePickup(id) {
    return this.http.post(`${this.URL}/unAutomatePickup`, id);
  }

  getAllPickupRequests(id) {
    return this.http.get(`${this.URL}/getAllPickupRequests/${id}`);
  }

  getPickupRequestCounts(id) {
    return this.http.get(`${this.URL}/getPickupRequestCounts/${id}`);
  }

  getCollectorWithLog(form) {
    return this.http.post(`${this.URL}/getCollectorWithLog`, form);
  }

  assignToCollector(form) {
    return this.http.post(`${this.URL}/assignToCollector`, form);
  }

  submitInventory(form) {
    return this.http.post(`${this.URL}/submitInventory`, form);
  }

  deleteNotifications(notifications) {
    return this.http.post(`${this.URL}/deleteNotifications`, notifications);
  }

  toggleNotifications(notifications) {
    return this.http.post(`${this.URL}/toggleNotifications`, notifications);
  }

  getUserName(form) {
    return this.http.post(`${this.URL}/getUserName`, form);
  }

  pingServerWithLocation(location) {
    return this.http.post(`${this.URL}/ping`, location);
  }

  getCollectorCollections(phone) {
    return this.http.get(`${this.URL}/getCollectorCollections/${phone}`);
  }

  getCollections(phone) {
    return this.http.get(`${this.URL}/getCollections/${phone}`);
  }

  getAddressWithCoordinates(loc) {
    return this.http.get(`${this.URL}/getAddressWithCoordinates/${loc}`);
  }

  getCollectionsHistory(users = "") {
    return this.http.get(`${this.URL}/getCollectionsHistory${users}`);
  }

  getCollectionsHistoryWithQuery(phone, query = "") {
    return this.http.get(
      `${this.URL}/getCollectionsHistoryWithQuery/${phone}${query}`
    );
  }
  getCollectorCollectionsHistoryWithQuery(phone, query = "") {
    return this.http.get(
      `${this.URL}/getCollectorCollectionsHistoryWithQuery/${phone}${query}`
    );
  }

  getCollectorCollectionsHistory(phone) {
    return this.http.get(`${this.URL}/getCollectorCollectionsHistory/${phone}`);
  }

  getProducerCollectionsHistory(phone) {
    return this.http.get(`${this.URL}/getProducerCollectionsHistory/${phone}`);
  }

  getSingleScrap(id) {
    return this.http.get(`${this.URL}/getSingleScrap/${id}`);
  }

  getAllContactMessages(id) {
    return this.http.get(`${this.URL}/getAllContactMessages`);
  }

  replyContactMessage(form) {
    return this.http.post(`${this.URL}/replyContactMessage`, form);
  }

  deleteContactMessage(id) {
    return this.http.delete(`${this.URL}/deleteContactMessage/${id}`);
  }
}

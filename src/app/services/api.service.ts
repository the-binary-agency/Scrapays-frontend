import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Listed_Scrap } from  '../models/listed_scrap';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  PHP_API_SERVER = this.env.backendUrl;

  constructor(private httpClient: HttpClient, private env: EnvironmentService) { }

  getListedScrap(): Observable<Listed_Scrap[]>{
    return this.httpClient.get<Listed_Scrap[]>(`${this.PHP_API_SERVER}/api/listedscrap`);
  }

  getSingleScrap( id ): Observable<Listed_Scrap[]>{
    return this.httpClient.post<Listed_Scrap[]>(`${this.PHP_API_SERVER}/api/getSingleScrap`, id);
  }

  listScrap(Listed_Scrap: any){
    return this.httpClient.post(`${this.PHP_API_SERVER}/api/listedscrap`, Listed_Scrap);
  }

  updateListed_Scrap(Listed_Scrap: Listed_Scrap){
    return this.httpClient.put<Listed_Scrap>(`${this.PHP_API_SERVER}/api/update.php`, Listed_Scrap);   
  }

  deleteListed_Scrap(id: number){
    return this.httpClient.delete<Listed_Scrap>(`${this.PHP_API_SERVER}/api/delete.php/?id=${id}`);
  }

  sendContactMessage( message ) {
     return this.httpClient.post(`${this.PHP_API_SERVER}/api/sendContactMessage`, message);
  }

  uploadCollectedScrap( scrap ) {
    return this.httpClient.post(`${this.PHP_API_SERVER}/api/listCollectedScrap`, scrap);
  }

}

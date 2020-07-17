import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Listed_Scrap } from  '../../models/listed_scrap';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../env/environment.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  SERVER = this.env.backendUrl;

  constructor(private httpClient: HttpClient, private env: EnvironmentService) { }

  getListedScrap(): Observable<Listed_Scrap[]>{
    return this.httpClient.get<Listed_Scrap[]>(`${this.SERVER}/listedscrap`);
  }

  getSingleScrap( id ): Observable<Listed_Scrap[]>{
    return this.httpClient.post<Listed_Scrap[]>(`${this.SERVER}/getSingleScrap`, id);
  }

  listScrap(Listed_Scrap: any){
    return this.httpClient.post(`${this.SERVER}/listScrap`, Listed_Scrap);
  }

  updateListed_Scrap(Listed_Scrap: Listed_Scrap){
    return this.httpClient.put<Listed_Scrap>(`${this.SERVER}/update.php`, Listed_Scrap);   
  }

  deleteListed_Scrap(id: number){
    return this.httpClient.delete<Listed_Scrap>(`${this.SERVER}/delete.php/?id=${id}`);
  }

  sendContactMessage( message ) {
     return this.httpClient.post(`${this.SERVER}/sendContactMessage`, message);
  }

  listCollectedScrap( scrap ) {
    return this.httpClient.post(`${this.SERVER}/listCollectedScrap`, scrap);
  }

}

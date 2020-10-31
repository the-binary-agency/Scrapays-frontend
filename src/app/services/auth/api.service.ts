import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Listed_Scrap } from '../../models/listed_scrap';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../env/environment.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  SERVER = this.env.backendUrl;

  constructor(private http: HttpClient, private env: EnvironmentService) {}

  getListedScrap(query?): Observable<Listed_Scrap[]> {
    return query
      ? this.http.get<Listed_Scrap[]>(`${this.SERVER}/listedscraps?${query}`)
      : this.http.get<Listed_Scrap[]>(`${this.SERVER}/listedscraps`);
  }

  getSingleScrap(id): Observable<Listed_Scrap[]> {
    return this.http.get<Listed_Scrap[]>(`${this.SERVER}/listedscraps/${id}`);
  }

  listScrap(Listed_Scrap: any) {
    return this.http.post(`${this.SERVER}/listedscraps`, Listed_Scrap);
  }

  updateListed_Scrap(Listed_Scrap: Listed_Scrap) {
    return this.http.put<Listed_Scrap>(
      `${this.SERVER}/update.php`,
      Listed_Scrap
    );
  }

  deleteListed_Scrap(id: number) {
    return this.http.delete<Listed_Scrap>(
      `${this.SERVER}/delete.php/?id=${id}`
    );
  }

  sendContactMessage(message) {
    return this.http.post(`${this.SERVER}/contactmessages`, message);
  }

  listCollectedScrap(scrap) {
    return this.http.post(`${this.SERVER}/collectedscraps`, scrap);
  }
}

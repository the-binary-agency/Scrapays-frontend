import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor ( public auth: AuthService, public token: TokenService ) { }
  
  public User: any = {};
  public Scrap: any = {
    metal:  0,
    aluminium:  0,
    plastic:  0,
    paper:  0,
    'pet bottles':  0,
  }
  public CollectedScrap: any = [];

  getUserData() {
    
  }
}

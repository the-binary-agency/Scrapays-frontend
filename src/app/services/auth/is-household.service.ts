import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IsHouseholdService {
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const Household: boolean = this.Token.Household();
    
    if (!Household) {
      this.router.navigateByUrl('/login/household');
    }
    
    return this.Token.Household();
  }

  constructor ( private Token: TokenService, private router: Router ) { }
}

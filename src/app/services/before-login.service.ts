import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class BeforeLoginService implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const loggedIn: boolean = this.Token.loggedIn();
    const admin: boolean = this.Token.Admin();
    if ( loggedIn ) {
       if (admin) {
      this.router.navigateByUrl('dashboard/listedScrap');
       } else {
      this.router.navigateByUrl('dashboard');
        }
    }
    return !this.Token.loggedIn();
  }

  constructor(private Token: TokenService, private router: Router) { }
}

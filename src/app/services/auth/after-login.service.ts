import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HeaderComponent } from '../../Constants/header/header.component';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginService implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const loggedIn: boolean = this.Token.loggedIn();
  if (!loggedIn) {
    this.router.navigateByUrl( 'login' );
    this.header.changeErrorMessage( 'Your session has expired or you are not logged in.' );
  }
    
    return this.Token.loggedIn();
  }

  constructor(private Token: TokenService, private router: Router, private header: HeaderComponent) { }

}

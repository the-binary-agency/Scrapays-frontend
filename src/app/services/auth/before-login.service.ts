import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HeaderComponent } from '../../Constants/header/header.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BeforeLoginService implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const loggedIn: boolean = this.Token.loggedIn();
    const admin: boolean = this.Token.Admin();
    if ( loggedIn ) {
       if (admin) {
      this.router.navigateByUrl('/dashboard/listedScrap');
      this.header.changeErrorMessage( 'You\'re alraedy logged in.' );
       } else {
            if ( this.Token.isEnterprise() ) {
            this.router.navigateByUrl('/dashboard/enterprise');
          } else if ( this.Token.isHousehold() ) { 
            this.router.navigateByUrl('/dashboard/household');              
          } else if ( this.Token.isVendor() ) { 
            this.router.navigateByUrl('/dashboard/vendor');
          } else if ( this.Token.isCollector() ) {
            this.router.navigateByUrl('/dashboard/collector');
          }
        }
    }
    return !this.Token.loggedIn();
  }

  constructor(private Token: TokenService, private router: Router, private header: HeaderComponent, private Auth: AuthService) { }
}

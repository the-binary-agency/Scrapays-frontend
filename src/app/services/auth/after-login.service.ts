import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HeaderComponent } from '../../Constants/header/header.component';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginService implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const loggedIn: boolean = this.Token.loggedIn();
  if (!loggedIn) {
    this.header.changeErrorMessage( 'Your session has expired or you are not logged in.' );
    this.router.navigateByUrl('/login/household')
    // this.document.location.href = 'https://scrapays.com';
  }
    
    return this.Token.loggedIn();
  }

  constructor ( private Token: TokenService, private router: Router, private header: HeaderComponent,
    @Inject(DOCUMENT) private document: Document
  ) { }

}

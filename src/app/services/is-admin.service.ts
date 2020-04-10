import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminService implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const Admin: boolean = this.Token.Admin();
    if (!Admin) {
      this.router.navigateByUrl('home');
    }
    
    return this.Token.Admin();
  }

  constructor(private Token: TokenService, private router: Router) { }
}

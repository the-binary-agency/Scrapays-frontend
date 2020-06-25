import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IsVendorService implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const Vendor: boolean = this.Token.Vendor();
    if (!Vendor) {
      this.router.navigateByUrl('/login/partners');
    }
    
    return this.Token.Vendor();
  }

  constructor(private Token: TokenService, private router: Router) { }
}
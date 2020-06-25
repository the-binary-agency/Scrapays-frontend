import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IsEnterpriseService {
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const Enterprise: boolean = this.Token.Enterprise();
    
    if (!Enterprise) {
      this.router.navigateByUrl('/login/enterprise');
    }
    
    return this.Token.Enterprise();
  }

  constructor ( private Token: TokenService, private router: Router ) { }
}

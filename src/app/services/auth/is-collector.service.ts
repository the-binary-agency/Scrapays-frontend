import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IsCollectorService implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const Collector: boolean = this.Token.Collector();
    
    if (!Collector) {
      this.router.navigateByUrl('/login/partners');
    }
    
    return this.Token.Collector();
  }

  constructor ( private Token: TokenService, private router: Router ) { }
  
}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IsProducerService
 implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise <boolean> {
    const Producer: boolean = this.Token.Producer();
    if (!Producer) {
      this.router.navigateByUrl('home');
    }
    
    return this.Token.Producer();
  }

  constructor(private Token: TokenService, private router: Router) { }
}
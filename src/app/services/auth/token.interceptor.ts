import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TokenService } from './token.service';
import { tap, catchError } from "rxjs/operators";
import { SidenavComponent } from '../../Constants/sidenav/sidenav.component';
import { HeaderComponent } from '../../Constants/header/header.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor( public token: TokenService, private sidenav: SidenavComponent, private header: HeaderComponent) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token.get()}`
      }
    });
    return next.handle( request ).pipe(
          // tap(evt => {
          //       if (evt instanceof HttpResponse) {
          //           if(evt.body && evt.body.success)
          //               this.toasterService.success(evt.body.success.message, evt.body.success.title, { positionClass: 'toast-bottom-center' });
          //       }
          //   }),
       catchError((err: any) => {
         if ( err instanceof HttpErrorResponse ) {
          //  const auth = this.inj.get(AuthService);
                  console.log('error is ', err.error);
           if ( err.error.message = 'Unauthenticated' ) {
             this.header.changeErrorMessage( 'Your session has expired. Please login again.' );
             this.sidenav.signOut();
                        // auth.logOut();
                        }
                    // try {
                    //   if ( err.error.message = 'Unauthenticated' ) {
                    //     this.Auth.logOut();
                    //     }
                    // } catch(e) {
                    //     // this.toasterService.error('An error occurred', '', { positionClass: 'toast-bottom-center' });
                    // }
                    //log error 
                }
                return of(err);
            })
    );
  }
}
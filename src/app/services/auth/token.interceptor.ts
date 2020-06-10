import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
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
      //     tap(evt => {
      //         if ( evt instanceof HttpResponse ) {
      //           console.log( 'evt is ', evt );
      //         }
      //       }),
      //  catchError((err: any) => {
      //    if ( err instanceof HttpErrorResponse ) {
      //             console.log('error is ', err.error.message);
      //      if ( err.error.message === 'Unauthenticated.' ) {
      //        this.header.changeErrorMessage( 'Your session has expired. Please login again.' );
      //        this.sidenav.signOut();
      //                   }
      //               // try {
      //               //   if ( err.error.message = 'Unauthenticated' ) {
      //               //     this.Auth.logOut();
      //               //     }
      //               // } catch(e) {
      //               //     // this.toasterService.error('An error occurred', '', { positionClass: 'toast-bottom-center' });
      //               // }
      //               //log error 
      //           }
      //           return of(err);
      //       })
    );
  }
}
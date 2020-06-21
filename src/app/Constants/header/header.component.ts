import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Subject } from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public loggedIn: boolean;
  public Admin: boolean;
  public Household: boolean;
  public Enterprise: boolean;
  public Vendor: boolean;
  public Collector: boolean;
  public _error = new Subject<string>();
  public authError = '';

  constructor (
    private router: Router, private Auth: AuthService,
    private Token: TokenService, public sidenav: SidenavComponent ) { 
    this.processAuthError();
  }

  ngOnInit(): void {
    this.processRoles();
  }

  processAuthError() {
    console.log('reset running');
    
    this._error.subscribe( message => this.authError = message );
    this._error.pipe(
      debounceTime(5000)
    ).subscribe( () => this.authError = '' );

    // var err = localStorage.getItem( 'error' );
    // if ( err ) {
    //   console.log('if working');
      
    //   this.changeErrorMessage( err );
    // }
  }

  public changeErrorMessage( error ) {
    console.log( 'change running' );
    this._error.next(   error );
    console.log(this.authError);
    
  }

  processRoles() {
    this.Auth.authStatus.subscribe( value => this.loggedIn = value);
    this.Auth.adminStatus.subscribe( value => this.Admin = value );
    this.Auth.householdStatus.subscribe( value => this.Household = value );
    this.Auth.enterpriseStatus.subscribe( value => this.Enterprise = value );
    this.Auth.collectorStatus.subscribe( value => this.Collector = value );
    this.Auth.vendorStatus.subscribe( value => this.Vendor = value );
  }

  logOut(event: MouseEvent){
    event.preventDefault();
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeHouseholdStatus(false);
    this.Auth.changeEnterpriseStatus(false);
    this.Auth.changeVendorStatus(false);
    this.Auth.changeCollectorStatus(false);
    this.router.navigateByUrl('/login');
  }

 clickMenu() { 
    this.sidenav.sidenav.toggle();
  }
  
}

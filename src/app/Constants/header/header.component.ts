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
  public Host: boolean;
  public Collector: boolean;
  public _error = new Subject<string>();
  public authError = '';
  navExpanded: boolean;

  constructor (
    private router: Router, private Auth: AuthService,
    private Token: TokenService, public sidenav: SidenavComponent ) { 
    this.processAuthError();
  }

  ngOnInit(): void {
    this.processRoles();
    // this.navExpanded = this.sidenav.sidenav.opened;
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
    this.Auth.HostStatus.subscribe( value => this.Host = value );
  }

  logOut(event: MouseEvent){
    event.preventDefault();
    var Admin = this.Admin;
    var Household = this.Household;
    var Enterprise = this.Enterprise;
    var Host = this.Host;
    var Collector = this.Collector;
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeHouseholdStatus(false);
    this.Auth.changeEnterpriseStatus(false);
    this.Auth.changeHostStatus(false);
    this.Auth.changeCollectorStatus(false);
    if ( Admin ) {
      this.router.navigateByUrl( '/login/partners' );
    } else if ( Enterprise ) {
      this.router.navigateByUrl( '/login/enterprise' );
    } else if ( Household ) {
      this.router.navigateByUrl( '/login/household' );
    } 
  }

  clickMenu() { 
    this.sidenav.sidenav.toggle();
    // console.log("side nav is opened: ",this.sidenav.sidenav.opened);
    // if ( this.sidenav.sidenav.opened == true ) {
    //   this.navExpanded = true;
    // } else {
    //    this.navExpanded = true;
    // }
  }
  
}

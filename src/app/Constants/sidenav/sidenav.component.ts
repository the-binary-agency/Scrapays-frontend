import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideMenuService } from 'src/app/services/general/side-menu.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDataService } from 'src/app/services/auth/user-data.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @ViewChild( 'sidenav' ) public sidenav: MatSidenav;
  @ViewChild( 'content' ) private content;

  public loggedIn: boolean;
  public Admin: boolean;
  public Household: boolean;
  public Enterprise: boolean;
  public Vendor: boolean;
  public Collector: boolean;
  modalTitle: any;
  modalBody: any;
  loading = false;

  constructor ( private sideNavService: SideMenuService, private router: Router,  private Auth: AuthService, private Token: TokenService,  private modal: NgbModal, private userData: UserDataService ) {
   }

  screenWidth: number;
  lastHome: string;
  User = this.userData.User;

  ngOnInit(): void { 
    this.processRoles();
    this.changeSidenavMode();
  }
  
  ngAfterViewInit(): void {
   this.sideNavService.sideNavToggleSubject.subscribe(()=> {
      this.sidenav.toggle();
   } );
    if ( this.screenWidth > 768 && this.loggedIn ) {
      if ( this.checkRoute() ) {
        this.sidenav.open(); 
      }
    } else {
      this.sidenav.close();
    }
  }
  
  changeSidenavMode() {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
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
    var Admin = this.Admin;
    var Household = this.Household;
    var Enterprise = this.Enterprise;
    var Vendor = this.Vendor;
    var Collector = this.Collector;
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeHouseholdStatus(false);
    this.Auth.changeEnterpriseStatus(false);
    this.Auth.changeVendorStatus(false);
    this.Auth.changeCollectorStatus(false);
    this.sidenav.close();
    if ( Admin ) {
      this.router.navigateByUrl( '/login/enterprise' );
    } else if ( Enterprise ) {
      this.router.navigateByUrl( '/login/enterprise' );
    } else if ( Household ) {
      this.router.navigateByUrl( '/login/household' );
    } else if ( Vendor ) {
      this.router.navigateByUrl( '/login/vendor' );
    } else if ( Collector ) {
      this.router.navigateByUrl( '/login/collector' );
    }
  }

  signOut() {
    var Admin = this.Admin;
    var Household = this.Household;
    var Enterprise = this.Enterprise;
    var Vendor = this.Vendor;
    var Collector = this.Collector;
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeHouseholdStatus(false);
    this.Auth.changeEnterpriseStatus(false);
    this.Auth.changeVendorStatus(false);
    this.Auth.changeCollectorStatus(false);
    if ( Admin ) {
      this.router.navigateByUrl( '/login/partners' );
    } else if ( Enterprise ) {
      this.router.navigateByUrl( '/login/enterprise' );
    } else if ( Household ) {
      this.router.navigateByUrl( '/login/household' );
    } 
    this.sidenav.close();
  }

  clickMenu(event: MouseEvent) {
    event.preventDefault();
    this.sidenav.toggle();
  }

  getRoute() {
    var route = this.router.url;
    return route.split( '/' )[ 1 ];
  }

  checkRoute() {
    if ( this.getRoute() == 'listing' ) {
      return false;
    }
    return true;
  }

  success( message ) {
    this.loading = false;
    this.modalTitle = 'Success';
    this.modalBody = message;
  }
  
  error( error ) {
    this.loading = false;
    this.modalTitle = 'Error';
    this.modalBody = error;
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

}